import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    res.render("users/join", {
        pageTitle: "Create Your WhatA Account"
    });
};

export const postJoin = async (req, res) => {
    const {
        loginId,
        password,
        password2,
        name,
        email,
    } = req.body
    const pageTitle = "Create Your WhatA Account"
    if (password !== password2) {
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "password confirmation doesn't match"
        })
    }
    const exists = await User.exists({
        $or: [{
            loginId
        }, {
            email
        }]
    });
    if (exists) {
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "The ID/Email already exists."
        })
    }
    try {
        await User.create({
            loginId,
            password,
            name,
            email,
        })
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: error._message,
        })
    }
};

export const getLogin = (req, res) => {
    res.render("users/login", {
        pageTitle: "Welcom to WhatA!"
    });
};

export const postLogin = async (req, res) => {
    const pageTitle = "Welcom to WhatA!"
    const {
        loginId,
        password
    } = req.body
    const user = await User.findOne({
        loginId,
        socialOnly: false
    });
    if (!user) {
        return res.status(400).render("users/login", {
            pageTitle,
            errorMessage: "The user does not exist."
        })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).render("users/login", {
            pageTitle,
            errorMessage: "Password is wrong.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        // access api
        const {
            access_token
        } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({
            email: emailObj.email
        });
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                loginId: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login")
    }
};

export const logout = (req, res) => {
    req.flash("info", "Bye Bye");
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("users/edit-profile", {
        pageTitle: "Edit Profile"
    });
}

export const postEdit = async (req, res) => {
    const {
        session: {
            user: {
                _id,
                email: sessionEmail,
                loginId: sessionLoginId,
                avatarUrl,
            },
        },
        body: {
            loginId,
            name,
            email,
        },
        file,
    } = req;

    // 이미 가입되어있는 이메일이나 ID로는 바꿀 수 없도록 만든다.

    let searchParam = [];
    if (sessionEmail !== email) {
        searchParam.push({
            email
        });
    }
    if (sessionLoginId !== loginId) {
        searchParam.push({
            loginId
        });
    }
    if (searchParam.length > 0) {
        const foundUser = await User.findOne({
            $or: searchParam
        });
        if (foundUser && foundUser._id.toString() !== _id) {
            return res.status(400).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This ID/email is already taken.",
            })
        }
    }
    console.log(file);
    const updateUser = await User.findByIdAndUpdate(
        _id, {
            avatarUrl: file ? file.location : avatarUrl,
            loginId,
            name,
            email,
        }, {
            new: true
        }
    );
    req.session.user = updateUser;
    return res.redirect(`/users/${_id}`);
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "깃헙으로 로그인한 유저는 비밀번호를 변경할 수 없습니다.");
        return res.redirect("/");
    }
    return res.render("users/change-password", {
        pageTitle: "Change Password"
    });
}

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: {
                _id
            },
        },
        body: {
            oldPassword,
            newPassword,
            newPassword2,
        }
    } = req

    const user = await User.findById(_id);
    const match = await bcrypt.compare(oldPassword, user.password)
    if (!match) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is wrong."
        })
    }
    if (oldPassword === newPassword) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "Please enter a different password from the previous one."
        })
    }
    if (newPassword !== newPassword2) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "password confirmation doesn't match."
        })
    }
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const {
        id
    } = req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
        return res.status(404).render("404", {
            pageTitle: "User not found."
        });
    }
    return res.render("users/profile", {
        pageTitle: `${user.name}'s profile`,
        user,
    });
};