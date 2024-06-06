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

    const { page = 1, limit = 10, available } = req.query;

    let { published, word } = req.query;

    if(published === 'true'){
        published = true;
    }else if(published === 'false'){
        published = false;
    }else{
        published = undefined
    }

    let where = {
        AND: [
            {
                published: published,
            },
            {
                OR:[
                    {title: {contains: word}},
                    {content: {contains: word}}
                ],
            }
        ]
    }

    const totalItems = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    try{
        if(page > totalPages || page <= 0 || isNaN(page)){
            return res.status(404).json({
                error: `The page you're looking for doesn't exist: Here's the total amount of pages: ${totalPages}`
            });
        }

        const postsList = await prisma.post.findMany({
            where,
            take: parseInt(limit),
            skip: offset,
        })

        let count = parseInt(postsList.length);
        if(count === 0){
            return res.status(404).json({
                status:404,
                success: false,
                count, 
                message: "No posts found"
            })
        } 

        return res.status(200).json({
            status:200,
            success: true,
            postsList,
            totalPages,
            currentPage: parseInt(page),
            totalItems
        })


    }catch(err){
        next(err);
    }

}

const update = async (req, res, next) => {

    let { slug } = req.params;


    let data = req.body;
    if(data.title){
        data.slug = makeSlug(data.title);
    }
    if(data.id){
        const err = new Error('You cant edit the field: ID');
        next(err);
    }

    try{
        const upPost = await prisma.post.update({
            where: {
                slug: slug
            },
            data: data
        });
        res.json({
            status:200,
            success: true,
            updated_post: upPost
        });
    }catch(err){
        next(err);
    }


}

const destroy = async (req, res, next) => {
    const { slug } = req.params;

    try{
        const dPost = await prisma.post.delete({
            where: {
                slug: slug
            }
        })
    
        return res.status(200).json({
            status: 200,
            success: true,
            post_deleted: dPost,
        });
    }catch(err){
        next(err);
    }


}

module.exports = {
    store,
    show,
    index,
    update,
    destroy
}