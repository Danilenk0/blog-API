import PostModel from '../model/Post.js'

export default class PostController  {

    static async all(req, res){

        try {
            const posts = await PostModel.find().populate('user').exec();
            return res.json({
                success:true,
                posts
            })
        } catch (error) {
            return res.status(500).json({
                message:"Failed to retrieve articles",
                error:error || "Unknown error"
            })
        }   
    }

    static async show(req, res){
        const postId = req.params.id;

        try {
            const updatedPost = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { viewsCount: 1 } },
                { new: true } 
            );
        
            if (!updatedPost) {
                return res.status(404).json({
                    message: 'Crticle not found',
                });
            }
        
            return res.json(updatedPost);
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to retrieve one of the articles',
                error:error || "Unknown error"
            });
        }
    }

    static async store(req, res){
        try {
            const doc = new PostModel({
                title: req.body.title,
                text: req. body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            })

            const post = await doc.save()

            return res.json({
                success:true,
                post
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message:'Failed to add an article',
                error:error || "Unknown error"
            })
        }
    }

    static async remove(req, res){
        try {
            const postId = req.params.id
            const deletePost = await PostModel.findOneAndDelete({_id:postId})

            if(!deletePost){
                return res.status(404).json({
                    message:'Post not found'
                })
            }

            return res.json({
                success:true,
                deletePost
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message:'Failed to delete an article',
                error:error || "Unknown error"
            })
        }
    }

    static async update(req, res){
        try {
            const postId = req.params.id;

            const updatedPost = await PostModel.findOneAndUpdate(
                { _id: postId },
                {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                    user: req.userId
                },
                { new: true }
            );
        
            if (!updatedPost) {
                return res.status(404).json({
                    message: 'Could not find an article to update',
                });
            }
        
            return res.json({
                success: true,
                post: updatedPost
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Failed to update on post',
                error:error || "Unknown error"
            });
        }
    }
}