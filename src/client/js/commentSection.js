import {
    async
} from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const addComment = (text, comment) => {

    const time = comment.createdAt;

    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    // const commentOwner = document.querySelector(".comment-owner");
    newComment.dataset.id = comment._id;
    newComment.className = "video__comment";

    const avatarBox = document.createElement("div")
    avatarBox.className = "comment-avatar__box comment-item"
    const avatarLink = document.createElement("a");
    avatarLink.setAttribute("href", `/users/${comment.owner._id}`)
    const avatar = document.createElement("img");
    if(!comment.owner.avatarUrl) {
        avatar.setAttribute("src", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png")
    } else {
        avatar.setAttribute("src", comment.owner.avatarUrl);

    }
    avatar.className = "comment-avatar";


    const contentBox = document.createElement("div")
    contentBox.className = "comment-content__box comment-item"
    const info = document.createElement("div")
    info.className = "comment-info"

    const commentOwnerLink = document.createElement("a");
    commentOwnerLink.setAttribute("href", `/users/${comment.owner._id}`)
    
    const commentOwner = document.createElement("span");
    commentOwner.innerText = comment.owner.name;
    commentOwner.id = "comment-owner"
    const createdAt = document.createElement("span");
    createdAt.className = "comment-createdAt"
    createdAt.innerText = new Date(comment.createdAt).toLocaleDateString("ko-kr", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

    const textBox = document.createElement("div")
    textBox.className = "comment-text__box"
    const textSpan = document.createElement("span")
    textSpan.className = ".comment-text"
    textSpan.innerText = text

    const btn = document.createElement("span")
    btn.innerText = "❌";
    btn.setAttribute("style", "cursor:pointer");
    btn.dataset.id = comment._id;
    btn.className = "delete__btn comment-item"


    newComment.appendChild(avatarBox);
    avatarBox.appendChild(avatarLink);
    avatarLink.appendChild(avatar);

    newComment.appendChild(contentBox);
    contentBox.appendChild(info);
    info.appendChild(commentOwnerLink);
    commentOwnerLink.appendChild(commentOwner);
    info.appendChild(createdAt);
    contentBox.appendChild(textBox);
    textBox.appendChild(textSpan)


    newComment.appendChild(btn);
    videoComments.prepend(newComment);

    // 댓글 삭제
    const deleteBtn = document.querySelectorAll(".delete__btn");
    deleteBtn.forEach(btn => btn.addEventListener("click", handleDelete));

    // 댓글 수 세기
    counting();
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    // const commentOwner = document.getElementById("comment-owner");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    // const ownerId = commentOwner.dataset.id;
    // const comment = document.querySelector(".video__comment")
    // const commentId = comment.dataset.id;

    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            // commentId
        }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const {
            newComment
        } = await response.json();
        addComment(text, newComment);
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}


// 댓글 삭제

const handleDelete = async (e) => {
    const id = e.target.dataset.id
    const comment = document.querySelector(`.video__comment[data-id="${id}"]`)
    comment.remove();
    counting();

    await fetch(`/api/comments/${id}`, {
        method: "DELETE",
    });
}

const deleteBtn = document.querySelectorAll(".delete__btn");
deleteBtn.forEach(btn => btn.addEventListener("click", handleDelete));

// 댓글 개수 세는 함수
const counting = async () => {
    const videoComments = document.querySelector(".video__comments ul");
    const countBox = document.querySelector(".comments-count");
    const videoId = videoContainer.dataset.id;
    const count = videoComments.childElementCount;
    countBox.innerText = `댓글 ${videoComments.childElementCount}개`;

    await fetch(`/api/comments/${videoId}/count`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            count
        }),
    });
}
counting();

// 댓글 오너 구하기