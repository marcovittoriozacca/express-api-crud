const { makeSlug } = require('../utils.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const store = async (req, res, next) => {
    const {title, image, content, published} = req.body;
    const data = {
        title,
        slug: makeSlug(title),
        image,
        content,
        published
    }
    try{
        const nPost = await prisma.post.create({data})
        res.status(200).json({
            status: 200,
            success: true,
            post_created: nPost,
        });
    }catch(err){
        next(err);
    }

}

module.exports = {
    store,
}