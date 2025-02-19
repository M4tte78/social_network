import { Card, Button } from 'react-bootstrap';
import LikeButton from './LikeButton';
import Comment from './Comment';

const Post = ({ post }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Card.Title>{post.username}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                {post.image && <Card.Img variant="top" src={post.image} />}
                <div className="d-flex justify-content-between mt-2">
                    <LikeButton postId={post.id} />
                    <Comment postId={post.id} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default Post;
