import jwt from 'jsonwebtoken';

//This middleware check, is user valid to to this action? such as wants to like a post.
//click the like button => the auth middleware check, is user valid or not? if user valid it just call (next) => to create like 

const auth = async (req, res, next) => {

    try {
        // authenticate real user 
        const token = req.headers.authorization.split(" ")[1];
        // own token
        const isCustomAuth = token.length < 500;
        
        //get data from token itself
        let decodedData;
        
        if(token && isCustomAuth){
            //it gives us data for specific token
            decodedData = jwt.verify(token, 'test');
            // push on the req userId.
            req.userId = decodedData?.id;
        }
        else{
            //if google oAuth token
            decodedData = jwt.decode(token);
            //sub is google's name for specific id that differenciate every single google user.
            req.userId = decodedData?.sub;
        }

        next();


    } catch (error) {
        console.log(error)
    }
};

export default auth;