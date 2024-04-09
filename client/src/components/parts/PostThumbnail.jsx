//página para miniaturas de post en dashboard

import { useContext, useEffect, useState } from 'react';
import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import '../css/responsive.css'
import { Link } from 'react-router-dom';
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import { useTranslation } from 'react-i18next';

function PostThumbnail({user_id, title, username, date, body, likes, visits, comments}) {
  const {dark} = useContext(DarkMode)
  const {user} = useContext(User)
  const { t } = useTranslation("global")

  return (
    <div className={dark ? "thumbnail dark-thumbnail" : "thumbnail clear-thumbnail"}>
        <div className="thumbnail-header">
          <h1>{title}</h1>
          <h1><Link to={username === user.name ? "/profile" : `/user/${user_id}`} className={dark ? "drkmd underline" : "strhov underline"}>{username}</Link> | {date}</h1>
        </div>
        <h3 className="thumbnail-body">{body}</h3>
        <div className="thumbnail-footer">
          <h3>{likes} {likes == 1 ? "like" : "likes"}</h3>
          <h3>{visits} {visits == 1 ? t("post.thumbnail-visit") : t("post.thumbnail-visits")}</h3>
          <h3>{comments.length} {comments.length === 1 ? t("post.thumbnail-comment") : t("post.thumbnail-comments")} </h3>
        </div>
    </div>
  );
}

export default PostThumbnail;