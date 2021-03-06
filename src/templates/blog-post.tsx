import * as React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';
import { get } from 'lodash';
import Img from 'gatsby-image';
import ReactDisqusComments from 'react-disqus-comments';
import AniLink from 'gatsby-plugin-transition-link/AniLink';

import Layout from '../components/layout/layout';
import Section from '../components/section';
import Grid from '../components/grid';

import * as styles from './blog-post.module.css';

class BlogPostTemplate extends React.Component<any, any> {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteDescription = post.excerpt;
    const { previous, next } = this.props.pageContext;
    const featuredImage = post.frontmatter.featuredImage
      ? post.frontmatter.featuredImage.childImageSharp.sizes
      : this.props.data.defaultFeaturedImage.childImageSharp.sizes;

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <div style={{ position: 'relative' }}>
          <Img className={styles.bgImage} sizes={featuredImage} />
          <div className={styles.heading}>
            <h1>{post.frontmatter.title}</h1>
            <small>{post.frontmatter.date}</small>
          </div>
        </div>
        <Section isBlog>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr />
          <ReactDisqusComments
            shortname="appfocused"
            identifier={`appfocused${this.props.location.pathname}`}
            title={post.frontmatter.title}
            url={`https://appfocused.com${this.props.location.pathname}`}
            onNewComment={() => {}}
          />

          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0
            }}
          >
            {!next && previous && (
              <li>
                <p>
                  <span>Read previous: </span>
                  <AniLink
                    to={previous.fields.slug}
                    rel="prev"
                    direction="left"
                    cover
                  >
                    {previous.frontmatter.title}
                  </AniLink>
                </p>
              </li>
            )}

            {next && (
              <li>
                <span>Read next: </span>
                <AniLink
                  to={next.fields.slug}
                  rel="next"
                  direction="right"
                  cover
                >
                  {next.frontmatter.title}
                </AniLink>
              </li>
            )}
          </ul>
        </Section>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    defaultFeaturedImage: file(relativePath: { eq: "polygons.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1200) {
          ...GatsbyImageSharpSizes
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        featuredImage {
          childImageSharp {
            sizes(maxWidth: 1200) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
    }
  }
`;
