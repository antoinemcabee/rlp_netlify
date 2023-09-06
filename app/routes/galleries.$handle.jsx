import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    useLoaderData,
    Await,
    useMatches,
    Link
} from '@remix-run/react';
import { Image } from '@shopify/hydrogen';

import {json, redirect} from '@shopify/remix-oxygen';
import { Description } from '~/components/About';
import { StyledLinkButton } from './_index';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import transition from '~/transition';
export const meta = ({data}) => {
    return [
        {title: `${data.title} | Rachel Lopez Photograph`}
    ];
};


export async function loader({request, params, context}) {
    const {handle: pgHandle} = params;
    const {storefront} = context;
  
    if (!pgHandle) {
      return redirect('/');
    }

    const handle = {handle: "gallery-" + pgHandle.toLowerCase(), type: 'gallery'}
    
    const { metaobject: {fields} } = await storefront.query(GALLERY_QUERY, {
        variables: {handle}
    });
    
    let gallery = {}

    fields?.forEach(item => {
        if (item?.key == "description" || item?.key == "title") {
            gallery[item?.key] = item.value
        }

        if(item?.key == "to_page") {
            gallery[item?.key] = item.reference.handle
        }

        if(item?.key == "content") {
            gallery["images"] = item.references.nodes
        }

        if(item?.key == "image") {
            gallery["logo"] = item.reference.image
        }

    })
  
    if (!gallery.title) {
      throw new Response(`Gallery ${handle} not found`, {
        status: 404,
      });
    }
    return json(gallery);
}

const Galleries = () => {
    const matches = useMatches();
    const data = matches[1].data

    const renderImages = () => {
        return (
            <div className={`flex flex-wrap`}>
                {
                    data.images.map((img, idx) => (
                        <Image data={img.image} className={`object-cover mb-2`} key={idx} width={'50%'} sizes="(min-width: 45em) 50vw, 100vw" aspectRatio='2/1.55'/>
                    ))
                }
            </div>
        )
    }

    
    return (
        <div className='px-6 pb-8 bg-white'>
            <span className="pt-12 mb-3 flex col items-center">
                <Image data={data.logo} className="" width={30} />
                <h1 className="text-xl ml-2 uppercase">{data.title}</h1>
            </span>
            <Description styles="mb-6">{data.description}</Description>
            {renderImages()}
            <nav className='flex justify-between items-center'>
                <StyledLinkButton to={`/`}><ArrowBackIosIcon style={{width: '10px', height: 'auto'}} />Home</StyledLinkButton>
                <StyledLinkButton to={`/pages/${data.to_page}`}>Book A Package<ArrowForwardIosIcon style={{width: '10px', height: 'auto'}} /></StyledLinkButton>
            </nav>
        </div>
    )
}

export default transition(Galleries);


const GALLERY_QUERY = `#graphql
query GalleryContent($handle: MetaobjectHandleInput) {
    metaobject(
        handle:  $handle 
    ) {
        handle,
        type 
    	fields {
          key
          value
          ...on MetaobjectField {
            references(first: 100) {
              ...on MetafieldReferenceConnection {
              	nodes {
                  ...on MediaImage {
                    image {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          reference {
            ...on Page {
              handle
            }
            ...on MediaImage {
              image {
                id
                url
                altText
              }
            }
        	}
      	}
		}
}
`