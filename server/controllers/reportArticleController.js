import db from '../models';
import helpers  from '../helpers/validationHelper';

const { ReportArticle, Article } = db;
const { isFieldValid } = helpers;
/**
 * @description will enable an article to be reported
 * @class ReportArticle
 */
class ArticleReporter {
    /**
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next to throw error to appropraite middleware
     * @returns {obeject} that indicated that the article was
     * successfully updated or otherwise
     */
    static async reportAnArticle(req, res, next) {
        const { id } = req.user;
        const { articleId } = req.params;
        const { report } = req.body;
        try{
            if(!(isFieldValid(report, 15))){
                return res.status(400).send({
                    success:false,
                    message:'report cant be less than 15 characters'
                });
            }
            const findArticle = await Article.findOne({
                where: { id: articleId}
            });
            if (!findArticle) {
                return res.status(404).send({
                    success:false,
                    message:'article not found'
                });
            }
            const reportedArticle = await ReportArticle.create({
                report: report.trim(),
                userId: id,
                articleId
            });
            return res.status(201).send({
                success: true,
                message: 'report successfully created',
                report: reportedArticle
            });
        } catch (err) {
           return next (err);
        }
    }

    /**
     *
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next to throw error to appropraite middleware
     * @returns {object} that indicates success or otherwise
     */
    static async getAllReports(req,res, next) {
        try {
            const allReports =  await ReportArticle.findAll({});
            if (!allReports[0]){
                return res.status(404).send({
                    success: false,
                    message: 'No article has been reported'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'All reports successfully returned',
                allReports
            });
        } catch(err) {
            return next(err);
        }
    }

    /**
     *
     * @param {object} req request sent to the route
     * @param {obeject} res response sent from the controller
     * @param {next} next to throw error to appropraite middleware
     * @returns {object} that indicates success or otherwise
     */
    static async getReportsOnAnArticle(req,res, next) {
        const { articleId } = req.params;
        try {
            const allReports =  await ReportArticle.findAll({
                where: {articleId}
            });
            if (!allReports[0]){
                return res.status(404).send({
                    success: false,
                    message: 'No article has been reported'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'All reports successfully returned',
                allReports
            });
        } catch(err) {
            return next(err);
        }
    }
}

export default ArticleReporter;
