import { Link } from 'react-router-dom';
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  useDeletePostMutation,
  useGetAllPostsQuery,
} from '../lib/generated/graphql';
import graphqlRequestClient from '../lib/client/graphqlRequestClient';
import formatDate from '../lib/utils/formatDate';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Container } from '@chakra-ui/react';

const HomePage = () => {
  const { data, isLoading, error, refetch } =
    useGetAllPostsQuery(graphqlRequestClient);

  const { mutate } = useDeletePostMutation(graphqlRequestClient, {
    onSuccess: (
      _data: DeletePostMutation,
      _variables: DeletePostMutationVariables,
      _context: unknown,
    ) => {
      refetch();
    },
  });

  const deletePost = (postId: string) => {
    mutate({ deletePostId: postId });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>error</div>;

  const github = () => {
    window.location.href = 'http://localhost:8080/auth/github';
  };

  return (
    <Container display={'flex'} justifyContent={'center'}>
      <div>
        <button onClick={github}>github</button>
        {data?.posts?.map((post) => (
          <div key={post.id}>
            <Link to={`/post/${post.id}`}>{post.id}</Link>
            <div>{post.title}</div>
            <div>{post.body}</div>
            <div>{formatDate(post.createdAt)}</div>
            <button onClick={() => deletePost(post.id)}>X</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
