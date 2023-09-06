import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import ImageArch from '~/components/ImgArch';
import Carousel from '~/components/Carousel';
import Testimonial from '~/components/Testimonial';
import About from '~/components/About';
import transition from '~/transition';

export const meta = () => {
  return [{title: 'Rachel Lopez | Home'}];
};

export async function loader({context}) {
  const {storefront} = context;
  const {metaobjects : { nodes: HHNode }} = await storefront.query(HOME_HERO_QUERY);
  const {metaobjects : { nodes: HeadlineNode }} = await storefront.query(HOME_HERO_HEADLINE_QUERY);
  const {metaobjects : { nodes: galleryNodes }} = await storefront.query(HOME_FEATURED_GALLERIES_QUERY);
  const {metaobjects : { nodes: testimonials }} = await storefront.query(TESTIMONIALS_QUERY);
  const {metaobjects : { nodes: AboutNode }} = await storefront.query(ABOUT_QUERY);
  
  const home_hero = HHNode[0].fields
  const headline_content = HeadlineNode[0].fields
  const about_content = AboutNode[0].fields

  return defer({ home_hero, headline_content, galleryNodes, testimonials, about_content });
}

const Homepage = () => {
  const { home_hero, headline_content, galleryNodes, testimonials, about_content } = useLoaderData();
  
  const aboutData = () => {
    let obj = {}

    about_content.forEach((item) => {
      if (item.key === "content") {
        obj['image'] = item.reference.image
      }
      if (item.key === "description_primary") {
        obj['descPrimary'] = item.value
      }
      if (item.key === "description_secondary") {
        obj['descSecondary'] = item.value
      }
      if (item.key === "subtitle") {
        obj['subtitle'] = item.value
      }
      if (item.key === "title") {
        obj['title'] = item.value
      }
      if (item.key === "to_page") {
        obj['to_page'] = item.reference.handle
      }
    })

    return obj
  }


  

  const renderHeadlineContent = () => {
    const image = headline_content[0]
    const subtitle = headline_content[1]
    const title = headline_content[2]
    
    return (
      <>
        <Image data={image.reference.image} width={300} className='opacity-10 absolute' sizes="(min-width: 45em) 50vw, 100vw"/>
        <div className="w-full h-full flex justify-center items-center flex-col ">
          <h2 className='text-white w-full text-[2.75rem] text-center'>{title.value}</h2> 
          <p className='text-white w-full text-sm text-center uppercase'>{subtitle.value}</p>
        </div>
      </>
    )
  }

  const renderFeaturedGallery = (gallery, idx) => {
    const even = !idx%2
    const description = gallery[0].value
    const img = gallery[1].reference.image
    const title = gallery[2].value
    const to_page = gallery[3].reference.title
    
    return (
      <div key={title+to_page.handle} className={`w-full h-full pb-8 z-10 ${even ? 'bg-white' : 'bg-[#F5F3EC]'}`}>
        <ImageArch img={img} mt={2}/>
        <div className='px-6 flex flex-col'>
          <StyledTitle style="self-end mt-8 uppercase">{title}</StyledTitle>
          <p className='text-justify text-sm'>{description}</p>
          <StyledLinkButton to={`/galleries/${to_page}`}>Gallery</StyledLinkButton>
        </div>
      </div>
    )
  }

  const renderFeaturedGalleries = () => {
    return (
      galleryNodes.map((gallery, idx) => (
        renderFeaturedGallery(gallery.fields, idx)
      ))
    )
  }


  const renderTestimonials = () => {
    return (
      testimonials.map(testimonial => (
        <Testimonial content={testimonial.fields[1]?.value} author={testimonial.fields[0]?.value} />
      ))
    )
  }

  return (
    <div>
      <div className="h-[85vh] z-10 relative">
        <Image loading='lazy' fit='cover' className="h-full object-cover" data={home_hero[0].references.nodes[0].image} sizes="(min-width: 45em) 50vw, 100vw"/>
      </div>
      <div className='px-6 h-80 bg-[#957152] w-full flex justify-center items-center relative'>
        {renderHeadlineContent()}
      </div>
      <div className='flex justify-center items-center flex-col relative'>
        {renderFeaturedGalleries()}
      </div>
      <div className=''>
        <Carousel items={renderTestimonials()}/>
      </div>
      <div>
        <About data={aboutData()} />
      </div>
    </div>
  );
}

export default transition(Homepage);


export const StyledLinkButton = ({ children, to, styles }) => (
  <Link to={`${to}`} prefetch="intent" className={`text-[.65rem] ${styles} mt-8 w-fit border-b-[0.5px] border-[#707070] italic `}>{ children }</Link>
)

export const StyledTitle = ({ children, style }) => (
  <h3 className={`text-3xl ${style}`}>{ children }</h3>
)



const HOME_HERO_QUERY = `#graphql
  query {
    metaobjects(type: "home_hero" first: 50) {
      nodes {
        type
        fields {
          key
          references(first: 50) {
            nodes {
              ...on MediaImage {
                image {
                  url
                  altText
                  id
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

const HOME_HERO_HEADLINE_QUERY = `#graphql
  query {
    metaobjects(type: "home_hero_headline" first: 50) {
      nodes {
        type
        fields {
          key
          value
          reference {
              ...on MediaImage {
                image {
                  url
                  altText
                  id
                  width
                  height
                }
            }
          }
        }
      }
    }
  }
`;

const HOME_FEATURED_GALLERIES_QUERY = `#graphql
query {
    metaobjects(type: "home_galleries" first: 50) {
      nodes {
        fields {
          key
          value
          reference {
            ...on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            ...on Page {
              onlineStoreUrl
              title
            }
          }
        }
      }
    }
  }
`

const TESTIMONIALS_QUERY =`#graphql
  {
    metaobjects(type: "testimonial" first: 5) {
      nodes {
        type
        fields {
          key
          value
        }
      }
    }
  }
`

const ABOUT_QUERY =`#graphql
  {
    metaobjects(type: "about_me" first: 1) {
      nodes {
        type
        fields {
          key
          value
          reference {
            ...on MediaImage {
              id
              image {
                url
                altText
                id
              }
            }
            ...on Page {
              handle
            }
          }
        }
      }
    }
  }
`


// {
//   metaobject(
//         handle: {
//             handle: "home-hero-oykuu27u",
//             type: "home_hero",
//         }
//     ) {
//         handle,
//         type 
//     		fields {
//           value
//         }
//     }
// }
