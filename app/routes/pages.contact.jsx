import { Link } from "@remix-run/react";
import { StyledLinkButton, StyledTitle } from "~/routes/_index";
import { Description } from "~/components/About";
import { json } from '@shopify/remix-oxygen';
import { useMatches } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { PatternFormat } from 'react-number-format';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import transition from "~/transition";
import MiniCalendar from "~/components/Calendar";
import 'react-calendar/dist/Calendar.css';


export async function loader({request, params, context}) {
    const {storefront} = context;
    
    const { metaobjects: {nodes} } = await storefront.query(CONTACT_QUERY);
    const data = nodes[0].fields
    return json(data);
}


const Contact = ({ data }) => {
    const [root, page] = useMatches()
    const form_fields_json = JSON.parse(page.data[1].value).fields
    const [dropdownValue, setDropdownValue] = useState('fruit');
    const [calendarValue, setCalendarValue] = useState(new Date())
    const [toggleCal, setToggleCal] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm()

    // console.log(form_fields_json)

    useEffect(() => {
        setToggleCal(false)
        setValue("Project Date", (calendarValue.getMonth()+1 + "-" + calendarValue.getDate() + "-"  + calendarValue.getFullYear().toString()))
    }, [calendarValue])


    const onSubmit = (data) => console.log(data)
    // console.log(watch("Project Date")) // watch input value by passing the name of it


    const handleDropdownChange = (event) => {
        setDropdownValue(event.target.value);
    };
    
    
    const renderFormFields = () => {
        return form_fields_json.map((field) => {
            if (field.displayType == "singleLine") 
                return <FormSingleLine styles="border-t-0 border-x-0 border-b-[0.5px] border-[#707070] focus:outline-none focus:border-b-[#9D9686] focus:ring-0 text-[.65rem] text-[#707070] p-0 p-b-2" key={field.name+field.type} field={field}/>
            if (field.displayType == "dropdown") 
                return <FormDropdown  key={field.name} fieldKey={field.key} title={field.name} items={field.values} styles={{label: "", select: "block font-[Futura]  px-0 w-full text-xs text-[#707070] bg-transparent border-0 border-b-[0.5px] border-[#707070] appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer", option: ""}} />
            if (field.displayType == "calendar") 
                return <FormCalendar title={field.name} key={field.name}/>
            if (field.displayType == "textBox") 
                return <FormTextBox title={field.name} styles={{input: "w-full h-12 focus:outline-none focus:border-b-[#9D9686] focus:ring-0 text-[.65rem] text-[#707070] p-0 p-b-2"}} key={field.name}/>
            
            
        })

    }

    const ErrorText = ({fieldName}) => (
        <p className="text-[#577C6B] mt-1 mb-4">{errors[fieldName] && <span>This field is required</span>}</p>
    )

    const FormSingleLine = ({field, styles}) => {
        return (
            <div className="flex flex-col text-[]">
                <label htmlFor={field.title}>{ field.name }</label>
                <input
                    className={`${styles}`}
                    key={field.name}
                    type={field.type}
                    {...register(field.name, { required: true })}
                />
                {/* errors will return when field validation fails  */}
                <ErrorText fieldName={field.name}/>
            </div>
        )
    }

    const FormDropdown = ({title, items, fieldKey, styles}) => {
        return (
            <div className="flex flex-col">
                <label htmlFor={title} className={`${styles.label}`}>
                    {title}
                </label>
                <select {...register(fieldKey, { required: true })} className={`${styles.select}`} >
                    <option className={`${styles.option}`} value={null}>Select</option>
                        {
                            items.map(item => {
                                return (
                                    <option className={`${styles.option}`} key={item} value={item}>{item}</option>
                                )
                            })
                        }
                </select>
                <ErrorText fieldName={fieldKey}/>
            </div>
        )
    }

    const FormCalendar = ({title}) => {
        return (
            <div className="flex flex-col w-full">
                <label htmlFor={title}>{title}</label>
                
                <span className="w-full border-t-0 border-x-0 border-b-[0.5px] border-[#707070] focus:outline-none focus:ring-0 p-0 flex flex-row justify-end" onClick={() => setToggleCal(!toggleCal)} >
                    <input {...register(title, { required: true })}   className="w-full border-0 focus:outline-none focus:border-b-[#9D9686] focus:ring-0 text-[.65rem] text-[#707070] p-0 flex flex-row justify-end"/><CalendarViewDayIcon  sx={{color: "#957152", cursor: 'pointer'}} />

                </span>
                <ErrorText fieldName={title}/>

                {
                    toggleCal ? <MiniCalendar h='100%' minW='100%' styles="mb-6" selectRange={false}  onChange={setCalendarValue} /> : null
                }
            </div>
        )
    }

    const FormTextBox = ({title, styles}) => {
        return (
            <div>
                <label htmlFor={title}>{title}</label>
                <textarea
                    rows={4}
                    className={`${styles.input}`}
                    key={title}
                    {...register(title, { required: true })}
                />
                <ErrorText fieldName={title}/>
            </div>
        )
    }

    return (
        <div className='px-6 pb-8 bg-white'>
            <h1 className="text-xl pt-12 uppercase">Contact Me</h1>
            <Description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Description>
            <div className="w-full mt-2 pt-8 px-8 pb-4 shadow-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {renderFormFields()}
                    <input className="text-[.65rem] text-[#707070] w-fit border-b-[0.5px] border-[#707070] italic" type="submit" />
                </form>
            </div>
            <div className="w-full h-8 my-4 bg-[#957152] "/>
            <nav className='flex justify-between items-start w-fit'>
                <StyledLinkButton styles='!mt-0' to={`/`}><ArrowBackIosIcon style={{width: '10px', height: 'auto' }} />Home</StyledLinkButton>
            </nav>
        </div>
    )
}

export default transition(Contact);

// const renderFormItem = (field) => {
    
// }

const CONTACT_QUERY = `#graphql
  query {
    metaobjects(type: "contact" first: 1) {
      nodes {
        type
        fields {
          key
          value
        }
      }
    }
}
`;