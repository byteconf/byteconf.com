import * as React from 'react'

import { DateTime } from 'luxon'
import Img from 'gatsby-image'

import { Helmet } from 'react-helmet'

import EventHero from '../components/Event/Hero'
import EventSpeakers from '../components/Event/Speakers'
import Layout from '../components/Layout'
import Schedule from '../components/Event/Schedule'
import Organizers from '../components/Event/Organizers'

import S3Url from '../utils/s3Url'
import './event.css'

import { graphql } from 'gatsby'

const CFPLink = ({ event: { cfp_link, name, slug } }) => (
  <div className="container mx-auto w-full px-4 md:px-0 md:w-1/2 text-center">
    <p className="text-lg">
      Bytesized Code's mission is to build a diverse community of programmers
      from around the world, and our Byteconf conferences are no different.
      Whether you're a first-time speaker, or a seasoned conference circuit
      veteran, we'd love to have you speak at Byteconf! Check out our Call For
      Papers below, to learn more about how Byteconf works, and submit your
      talk!
    </p>
    <p className="py-8">
      <a
        className="text-2xl hover:bg-orange-700 text-white bg-orange-800 transition-all w-full px-4 py-2 shadow hover:shadow-2xl rounded"
        href={cfp_link}
      >
        View the Call for Papers{' '}
        <span className="hidden xl:inline">for {name}</span>
      </a>
    </p>
  </div>
)

const Sponsors = ({
  event: { name, status, sponsor_interest_link, sponsorship_tiers },
}) => (
  <div className="mt-16 mb-32">
    <div className="bg-white rounded-lg shadow w-full container mx-auto md:mb-0 p-8 flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-8">
        Sponsors and community partners
      </h2>

      {!!sponsorship_tiers &&
        sponsorship_tiers.map(({ section_name, sponsors }) => (
          <div className="py-4 w-full flex flex-col items-center">
            <h3 className="text-2xl font-medium">{section_name}</h3>
            <div className="md:flex justify-center py-8 w-full md:w-1/3 justify-around">
              {!!sponsors &&
                sponsors.map(({ company_name, image, url }) => (
                  <div className="transition-all grayscale-1 hover:grayscale-0">
                    <a href={url} title={company_name}>
                      <Img fixed={image.asset.fixed} />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        ))}

      {!['concluding', 'finished'].includes(status) && (
        <p className="mt-8 text-lg">
          Interested in sponsoring {name}?{' '}
          <a
            className="text-red-800 hover:text-red-600 transition-all"
            href={sponsor_interest_link}
          >
            View the sponsorship prospectus
          </a>
          .
        </p>
      )}
    </div>
  </div>
)

const Event = ({ data }) => {
  const event = data.sanityEvent
  const cover = event.og_meta_image_path
    ? event.og_meta_image_path
    : event.cover
    ? event.cover.asset.fluid.src
    : S3Url('headers/attendees.jpg')

  const metaTitle = `${event.name} - ${DateTime.fromISO(
    event.start_date
  ).toLocaleString(DateTime.DATE_FULL)}`

  return (
    <Layout title={metaTitle}>
      <Helmet>
        <meta name="description" content={event.simple_copy} />
        <meta property="og:description" content={event.simple_copy} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={cover} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@byteconf" />
      </Helmet>
      <EventHero event={event} />
      <>
        <svg
          className="md:-mt-24 relative"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={{ zIndex: -1 }}
        >
          <path
            className="shadow-inner"
            fill="#FEEBC8"
            fill-opacity="1"
            d="M0,128L60,154.7C120,181,240,235,360,240C480,245,600,203,720,176C840,149,960,139,1080,122.7C1200,107,1320,85,1380,74.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
        <div>
          <div className="bg-orange-200 text-black text-center pb-24">
            <EventSpeakers event={event} />
            {['announced', 'planning'].includes(event.status) && (
              <CFPLink event={event} />
            )}
          </div>

          <svg
            className="-mt-48 relative inner-shadow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            style={{ zIndex: -1 }}
          >
            <path
              fill="#FEEBC8"
              fill-opacity="1"
              d="M0,288L80,293.3C160,299,320,309,480,298.7C640,288,800,256,960,240C1120,224,1280,224,1360,224L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
          {!['planning', 'announced'].includes(event.status) && (
            <Schedule event={event} />
          )}
          {event.sponsorship_tiers.length ? <Sponsors event={event} /> : null}
          {event.organizers.length ? <Organizers event={event} /> : null}
        </div>
      </>
    </Layout>
  )
}

export const pageQuery = graphql`
  query EventQuery($slug: String!) {
    sanityEvent(slug: { eq: $slug }) {
      _id
      slug
      start_date
      end_date
      name
      status
      location
      simple_copy
      event_type
      youtube_playlist
      sponsor_interest_link
      cfp_link
      ck_rsvp_form_id
      rsvp_url
      cover {
        asset {
          fluid(maxWidth: 800) {
            ...GatsbySanityImageFluid
          }
        }
      }
      cover_path
      og_meta_image_path
      event_speakers {
        available_live
        speaker {
          _id
          name
          company
          static_image_path
          github
          image {
            asset {
              fluid(maxWidth: 400) {
                ...GatsbySanityImageFluid
              }
            }
          }
          twitter
          website
        }
      }
      talks {
        _id
        name
        description
        level
        time
        slides
        position
        event_speaker {
          available_live
          speaker {
            _id
            name
            company
            static_image_path
            github
            twitter
            website
            image {
              asset {
                fluid(maxWidth: 100) {
                  ...GatsbySanityImageFluid
                }
              }
            }
          }
        }
      }
      organizers {
        name
        twitter
        image {
          asset {
            fixed(width: 300) {
              ...GatsbySanityImageFixed
            }
          }
        }
      }
      sponsorship_tiers {
        section_name
        sponsors {
          company_name
          url
          image {
            asset {
              fixed(width: 150) {
                ...GatsbySanityImageFixed
              }
            }
          }
        }
      }
    }
  }
`

export default Event
