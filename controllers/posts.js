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

const show = async (req, res, next) => {
    const { slug } = req.params;

    try{
        const fPost = await prisma.post.findUnique({
            where: {
                slug: slug
            }
        })
        if(!fPost){
            return res.status(404).json({
                status: 400,
                success: false,
                message: `No post with slug: ${slug} found.`
            })
        }
        return res.status(200).json({
        status: 200,
        success: true,
        post: fPost,
    });
    }catch(err){
        next(err)
    }


}

const index = async (req, res, next) => {

    let { published, word } = req.query;

    if(published === 'true'){
        published = true;
    }else if(published === 'false'){
        published = false;
    }else{
        published = undefined
    }

    try{
        const postsList = await prisma.post.findMany({
            where: {
                published: published,
                OR:[
                    {title: {contains: word}},
                    {content: {contains: word}}
                ],
            },
            
        })
        res.json(postsList)

    }catch(err){
        next(err);
    }

}

const update = async (req, res, next) => {

    let { slug } = req.params;
    let data = req.body;
    data.slug = makeSlug(data.title);

    try{
        const upPost = await prisma.post.update({
            where: {
                slug: slug
            },
            data: data
        });
        res.json({
            up: upPost
        });
    }catch(err){
        next(err);
    }


}

module.exports = {
    store,
    show,
    index,
    update
}