import db from '../../models';
import Validation from '../../helpers/validation/validations';

const { Article, HighlightedComment, User, UserHighlightedComment } = db;
const { isFieldValid }  = Validation;
/**
 * @description allows users to comment on certain areas of an article
 * @class HighlightedComment
 */
class HighlightedComments {
    /**
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next throws error to the appropraite middleware
     * @returns {obeject} that indicated that higlighted Comment was
     * successfully added or otherwise
     */
    static async addComment (req, res, next) {
        const { id } = req.user;
        const { articleId } = req.params;
        const { content } = req.body;
        try{
            if (!(isFieldValid(content,15))) {
                return res.status(400).send({
                    success: false,
                    message: 'content can\'t contain less than 15 characters',
                });
            }
            const article = await Article.findOne({
                where : { id: articleId }
            });
            if (!article) {
                return res.status(400).send({
                    success: false,
                    message: 'article not found',
                });
            }
            const { dataValues: { body }} = article;
            if(!(body.includes(content))) {
                return res.status(400).send({
                    success: false,
                    message:
                    'highlight must be present in the body to enable comment',
                });
            }
            const comment = await HighlightedComment.create({
                content,
                articleId,
            });
            const user = await User.findOne({
                where : { id }
            });
            const userhiglights = await user.addUsersHighlights(comment);
            return res.status(201).send({
                success: true,
                message: 'hightlighted comment successfully created',
                comment,
                userhiglights
            });
        } catch(err) {
            return next(err);
        }
    }

    /**
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next throws error to the appropraite middleware
     * @returns {obeject} that indicated that the highlighted * comment was
     * successfully updated or otherwise
     */
    static async updateComment(req, res, next) {
        const { id } = req.user;
        const { commentId } = req.params;
        const { content } = req.body;
        try{
            if (!(isFieldValid(content,15))) {
                return res.status(400).send({
                    success: false,
                    message: 'content can\'t contain less than 15 characters',
                });
            }
            const highlightComment = await HighlightedComment.findOne({
                 where : { id: commentId }
            });
            if (!highlightComment) {
                return res.status(400).send({
                    success: false,
                    message: 'highlightedComment not found',
                });
            }
            const owner = await UserHighlightedComment.findOne({
                where: { highlightedCommentId: highlightComment.id }
            });
            if (owner.dataValues.userId !== id) {
                return res.status(404).send({
                    success: false,
                    message: 'you don\'t have permission to update this comment'
                });
            }
            const article = await Article.findOne({
                where : { id: highlightComment.dataValues.articleId }
            });
            const { dataValues: { body } } = article;
            if(!(body.includes(content))) {
                return res.status(400).send({
                    success: false,
                    message:
                     'highlight must be present in the body to enable comment',
                });
            }
            const updatedComment = await HighlightedComment.update({
                content: content
            }, { where: { id : commentId}});
                return res.status(200).send({
                    success: true,
                    message: 'highlightedComment was successfully updated',
                    updatedComment
                });
        } catch(err) {
           return next(err);
        }
    }

    /**
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next throws error to the appropraite middleware
     * @returns {obeject} that indicated that the highlighted * comment was
     * successfully updated or otherwise
     */
    static async deleteComment(req, res, next) {
        const { id } = req.user;
        const { commentId } = req.params;

        try{
            const highlightedComment = await HighlightedComment.findOne({
                 where : { id: commentId }
            });
            if (!highlightedComment) {
                return res.status(400).send({
                    success: false,
                    message: 'highlightedComment not found',
                });
            }
            const owner = await UserHighlightedComment.findOne({
                where: { highlightedCommentId: highlightedComment.id }
            });
            if (owner.dataValues.userId !== id) {
                return res.status(404).send({
                    success: false,
                    message: 'you don\'t have permission to update this comment'
                });
            }
            const deletedComment = highlightedComment.destroy();
            return res.status(200).send({
                success: true,
                message: 'comment successfully deleted',
                deletedComment,

            });
        } catch(err) {
           return next(err);
        }
    }
}

export default HighlightedComments;
