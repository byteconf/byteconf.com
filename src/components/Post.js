import React from 'react'
import ReactMarkdown from 'react-markdown'

const Post = ({ post }) => (
  <a className="font-bold pb-8 odd:pr-8 w-full md:w-1/2" href={post.slug}>
    <div className={`w-full h-full`}>
      <div className="bg-white shadow hover:shadow-xl transition-all p-8 text-2xl flex items-center h-full border border-gray-200">
        {post.title}
      </div>
    </div>
  </a>
)

const Full = ({ post }) => (
  <a className="w-full h-full bg-white flex-1 mb-4" href={`/` + post.slug}>
    <div className="bg-white shadow hover:shadow-xl transition-all p-8 flex flex-col h-full my-4 border border-gray-200">
      <h3 className="text-3xl font-bold">{post.title}</h3>
      <h4 className="text-xl py-4">By {post.primary_author.name}</h4>
      <ReactMarkdown
        allowedTypes={['root', 'text', 'paragraph']}
        className="hidden md:block py-8 text-lg italic text-gray-800 leading-normal"
        source={post.excerpt}
      />
      <p className="text-xl">
        Published {new Date(post.published_at).toLocaleDateString('en-US')}
      </p>
    </div>
  </a>
)

const Switcher = ({ full, post }) =>
  full ? <Full post={post} /> : <Post post={post} />

export default Switcher