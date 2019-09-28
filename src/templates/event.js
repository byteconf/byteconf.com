import * as React from 'react'

import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import Nav from '../components/Nav'
import EventHeader from '../components/Event/Header'
import EventHero from '../components/Event/Hero'
import EventSpeakers from '../components/Event/Speakers'
import Footer from '../components/Event/Footer'
import Schedule from '../components/Event/Schedule'
import Sponsors from '../components/Event/Sponsors'

import S3Url from '../utils/s3Url'
import './event.css'

import { graphql } from 'gatsby'

const CFPLink = ({ event: { cfp_link, name, slug } }) => (
  <div className="bg-white text-black text-center py-16">
    <h3 className="text-3xl text-bold uppercase px-4">
      <a
        className="no-underline text-black hover:text-grey-darker"
        href={cfp_link}
      >
        <span className="mr-4">
          <i className="fas fa-lightbulb" />
        </span>
        Have an idea for a talk at {name}?
      </a>
    </h3>
  </div>
)

const SponsorLink = ({ event }) => (
  <div className="bg-yellow-dark text-white text-center py-16" id="speakers">
    <h3 className="text-3xl text-bold uppercase px-4">
      <a
        className="text-white no-underline hover:text-green-darker"
        href={event.sponsor_interest_link}
      >
        <span className="mr-4">
          <i className="fas fa-handshake" />
        </span>
        Want to sponsor {event.name}?
      </a>
    </h3>
  </div>
)

const SponsorsIfReact = ({ event: { slug } }) =>
  slug === 'react-2018' && <Sponsors />

const SpeakersIfConf = ({ event }) =>
  event.event_type === 'conference' && <EventSpeakers event={event} />

const Event = ({ data }) => {
  const event = data.sanity.allEvents.length && data.sanity.allEvents[0]
  const cover = S3Url(event.cover_path || 'headers/attendees.jpg')

  return (
    <Layout>
      <Helmet>
        <title>{event.name} | Byteconf</title>
        <meta name="description" content={event.simple_copy} />
        <meta property="og:title" content={event.name} />
        <meta property="og:description" content={event.simple_copy} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={cover} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@byteconf" />
      </Helmet>
      <Nav customTitle={event.name} showSubtitle={false} />
      <EventHero event={event} />
      <svg
        className="md:-mt-24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#FEEBC8"
          fill-opacity="1"
          d="M0,128L60,154.7C120,181,240,235,360,240C480,245,600,203,720,176C840,149,960,139,1080,122.7C1200,107,1320,85,1380,74.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
      {event.status === 'announced' ? (
        <div>
          <CFPLink event={event} />
          <SponsorLink event={event} />
        </div>
      ) : (
        <div>
          <SpeakersIfConf event={event} />
          <svg
            className="-mt-24 -mb-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#FEEBC8"
              fill-opacity="1"
              d="M0,288L80,293.3C160,299,320,309,480,298.7C640,288,800,256,960,240C1120,224,1280,224,1360,224L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
          <Schedule event={event} />
          <SponsorsIfReact event={event} />
        </div>
      )}
      <Footer event={event} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query EventQuery($slug: String!) {
    sanity {
      allEvents(where: { published: true, slug: $slug }) {
        _id
        slug
        icon
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
        cover_path
        event_speakers {
          available_live
          speaker {
            _id
            name
            company
            static_image_path
            github
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
            }
          }
        }
      }
    }
  }
`

export default Event
