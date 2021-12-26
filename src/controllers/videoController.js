import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import {
    async
} from "regenerator-runtime";

export const home = async (req, res) => {
    const goals = await Video.find({
        category: "goals"
    }).sort({
        createdAt: "desc"
    }).limit(4).populate("owner");
    const funs = await Video.find({
        category: "funs"
    }).sort({
        createdAt: "desc"
    }).limit(4).populate("owner");
    const recordings = await Video.find({
        category: "recordings"
    }).sort({
        createdAt: "desc"
    }).limit(4).populate("owner");
    res.render("videos/home", {
        pageTitle: "home",
        goals,
        funs,
        recordings,
    });
}
export const watch = async (req, res) => {
    const {
        id
    } = req.params;

    const video = await Video.findById(id)
        .populate("owner")
        .populate({
            path: "comments",
            populate: {
                path: "owner",
                model: "User",
            }
            // populate: { path: 'owner', select: 'video' },
        });
    if (!video) {
        return res.render("404", {
            pageTitle: "Video not found."
        });
    }

    // console.log(comments);

    return res.render("videos/watch", {
        pageTitle: video.title,
        video,
    });
}
export const getEdit = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        user: {
            _id
        },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {
            pageTitle: "Video not found."
        });
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", {
        pageTitle: `Edit: ${video.title}`,
        video,
    });
}
// export const postEdit = async (req, res) => {
//     const {
//         params: {
//             id,
//         },
//         body: {
//             title,
//             description,
//             hashtags,
//         },
//     } = req;

//     const video = await Video.findByIdAndUpdate(id, {
//         title,
//         description,
//         hashtags: Video.hashtagForm(hashtags),
//     });
//     if (!video) {
//         return res.status(404).render("404", {
//             pageTitle: "Video not found."
//         });
//     }
//     return res.redirect("/")
// }

export const postEdit = async (req, res) => {
    const {
        user: {
            _id
        },
    } = req.session;
    const {
        id
    } = req.params;
    const {
        title,
        description,
        hashtags,
        category,
    } = req.body;
    const video = await Video.findById({
        _id: id
    });
    if (!video) {
        return res.status(404).render("404", {
            pageTitle: "Video not found."
        });
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the the owner of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.hashtagForm(hashtags),
        category,
    });
    req.flash("success", "Changes saved.");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    res.render("videos/upload", {
        pageTitle: "Upload a new video"
    });
}
export const postUpload = async (req, res) => {
    const {
        user: {
            _id
        },
    } = req.session;
    const {
        video,
        thumb
    } = req.files;
    const {
        title,
        description,
        hashtags,
        category,
    } = req.body;
    if (!category) {
        return res.status(400).render("videos/upload", {
            pageTitle: "Upload a new video",
            errorMessage: "Please choose the type of video.",
        });
    }
    try {
        let newVideo
        if (!thumb) {
            newVideo = await Video.create({
                title,
                description,
                fileUrl: video[0].path,
                owner: _id,
                hashtags: Video.hashtagForm(hashtags),
                category,
            });
        } else {
            newVideo = await Video.create({
                title,
                description,
                fileUrl: video[0].path,
                thumbUrl: thumb[0].path,
                owner: _id,
                hashtags: Video.hashtagForm(hashtags),
                category,
            });
        }
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("videos/upload", {
            pageTitle: "Upload a new video",
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        user: {
            _id
        },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {
            pageTitle: "Video not found."
        });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const {
        keyword
    } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        });
    }
    return res.render("videos/search", {
        pageTitle: "Search",
        videos
    });
};

export const categoryPage = async (req, res) => {
    const categoryPage = req.url

    const goals = await Video.find({
        category: "goals"
    }).sort({
        createdAt: "desc"
    }).populate("owner");;

    const funs = await Video.find({
        category: "funs"
    }).sort({
        createdAt: "desc"
    }).populate("owner");;

    const recordings = await Video.find({
        category: "recordings"
    }).sort({
        createdAt: "desc"
    }).populate("owner");;
    if (categoryPage === "/goals") {
        res.render(`videos${categoryPage}`, {
            pageTitle: "What A Goals!",
            goals
        })
    }
    if (categoryPage === "/funs") {
        return res.render(`videos${categoryPage}`, {
            pageTitle: "What A Funs!",
            funs,
        })
    }
    if (categoryPage === "/recordings") {
        return res.render(`videos${categoryPage}`, {
            pageTitle: "What A Recordings!",
            recordings,
        })
    }
}

export const registerView = async (req, res) => {
    const {
        id
    } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        session: {
            user
        },
        body: {
            text,
            // ownerId
        },
        params: {
            id
        },
    } = req;
    const video = await Video.findById(id);
    // const commentOwner = await User.findById(ownerId);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
        // ownerName: commentOwner.name
    });
    const newComment = await Comment.findById(comment._id).populate("owner");

    video.comments.push(comment._id);
    video.save();
    // commentOwner.comments.push(comment._id);
    // commentOwner.save();
    return res.status(201).json({
        // newCommentId: newComment._id,
        // newCommentOwner: newComment.owner
        newComment
        // commentOwner: commentOwner.name
    });
};

export const deleteComment = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        user: {
            _id
        },
    } = req.session;

    const comment = await Comment.findById(id);
    // const video = await Video.findById(comment.video);
    // const owner = await User.findById(comment.owner);
    if (!comment) {
        return res.status(404).render("404", {
            pageTitle: "comment not found."
        });
    }
    if (String(comment.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Comment.findByIdAndDelete(id);
    // video.comments.filter(comment => comment !== id);
    // video.save();
    // owner.comments.filter(comment => comment !== id);
    // owner.save();
    // return res.redirect("/")
};

export const countComments = async (req, res) => {
    const {
        body: {
            count
        },
        params: {
            id
        },
    } = req;

    const video = await Video.findByIdAndUpdate(id, {
        commentsCount: count
    });
    if (!video) {
        return res.sendStatus(404);
    }
    video.commentsCount = count
    // console.log(video);
    return res.sendStatus(200);
}