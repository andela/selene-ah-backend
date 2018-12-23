/**
 * @description include likecounts in comment
 */
class LikesCount{
      /**
   *
   * @param {object} comments - The comments to add like counts
   * @returns {object} The comments that has like counts
   */
  static allLikeCount(comments){
    const cloneComment = [...comments.rows];
   return cloneComment.map((row)=>{
      const commentObject= JSON.parse(JSON.stringify(row));
      commentObject.likesCount = commentObject.commentReaction.length;
        delete commentObject.commentReaction;
        return commentObject;
    });
  }

  /**
   *
   * @param {object} comment - The comment to add like counts
   * @returns {object} The comment that has like counts
   */
  static singleLikeCount(comment){
    comment = JSON.parse(JSON.stringify(comment));
    comment.likesCount = comment.commentReaction.length;
    delete comment.commentReaction;
    return comment;
  }
}
export default LikesCount;
