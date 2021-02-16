import React , { useState, useEffect }from 'react'
import Avatar from "@material-ui/core/Avatar"
import './Post.css';
import { db } from "./firebase";
import firebase from "firebase"; 
import likeIcon from "./Assets/like.png"
import commentIcon from "./Assets/comment.png"
import shareIcon from "./Assets/share.png";

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }  
        return () => {
          unsubscribe();
        };
      }, [postId]);

    const postComment = (e) => {
      e.preventDefault();

      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setComment('');
    }

    return (
        <div className="Post">
            <div className="Post_header">
                <Avatar className="post-avatar"
                alt={username}
                src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3> 
            </div>
            <img className="post-img" src={imageUrl} />
            <div className="post_stats">
              <img className="post_stats_likeIcon" src={likeIcon} />
              <img className="post_stats_commentIcon" src={commentIcon} />
              <img className="post_stats_shareIcon" src={shareIcon} />
            </div>
            
            <h4 className="post-text"><strong><span className="post-userName">{username}</span></strong>{caption}</h4>
            
            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                    <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            
            {
                user && (
                    <form className="post_commentBox">
                        <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                        disabled={!comment}
                        className="post_button"
                        type="submit"
                        onClick={postComment}
                        >
                        Post
                        </button> 
                    </form>
                )
            }
        </div>
    )
}

export default Post
