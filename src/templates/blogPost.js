import * as React from 'react'

import { Link, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'

import './blogPost.scss'

const Author = ({
  author: { profile_image, name, bio, facebook, twitter, website },
  justName = false,
}) => (
  <div className="author flex items-center my-12">
    {profile_image && (
      <img
        className="w-16 h-16 rounded-full mr-4 shadow-lg hover:shadow-2xl inner-shadow transition-all"
        src={profile_image}
        alt={name}
      />
    )}
    <div>
      <p className="text-xl pb-2 text-black font-bold leading-none">{name}</p>
      {!justName && (
        <React.Fragment>
          {bio && <p className="pb-4">{bio}</p>}
          <p className="text-grey-dark">
            {facebook && (
              <a href={facebook}>
                <i className="text-black hover:text-green-800 transition-all roman mr-4 fab fa-facebook" />
              </a>
            )}
            {twitter && (
              <a href={`https://twitter.com/${twitter}`}>
                <i className="text-black hover:text-blue-800 transition-all roman mr-4 fab fa-twitter" />
              </a>
            )}
            {website && (
              <a href={website}>
                <i className="text-black hover:text-gray-800 transition-all roman mr-4 fas fa-link" />
              </a>
            )}
          </p>
        </React.Fragment>
      )}
    </div>
  </div>
)

const Post = ({ data }) => {
  const post = data && data.ghostPost
  return (
    <Layout title={post.title}>
      <Helmet>
        <meta property="og:type" content="website" />
        {post.feature_image && (
          <meta property="twitter:image" content={post.feature_image} />
        )}
        {post.feature_image && (
          <meta property="og:image" content={post.feature_image} />
        )}
        {post.custom_excerpt && (
          <meta property="twitter:description" content={post.custom_excerpt} />
        )}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@byteconf" />
      </Helmet>
      <div className="container mx-auto lg:flex">
        <div className="w-full">
          <div className="blog-post px-4 md:px-0">
            <div className="pt-12">
              <div className="uppercase tracking-wide font-semibold">
                {new Date(post.published_at).toLocaleDateString('en-US')}{' '}
                <span className="text-black font-light">&middot;</span>{' '}
                <Link
                  className="no-underline text-orange-800 hover:underline"
                  to={`/` + post.primary_tag.slug}
                >
                  {post.primary_tag.name}
                </Link>
              </div>
              <h1 className="mt-16">{post.title}</h1>
              <Author author={post.primary_author} justName />
            </div>
            <div
              className="post-full-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
            <Author author={post.primary_author} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($slug: String!) {
    ghostPost(slug: { eq: $slug }) {
      id
      custom_excerpt
      feature_image
      html
      title
      feature_image
      published_at
      primary_tag {
        name
        slug
      }
      tags {
        name
        slug
      }
      primary_author {
        name
        bio
        slug
        profile_image
        website
        facebook
        twitter
      }
    }
  }
`

export default Post
