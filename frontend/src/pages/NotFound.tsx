import { MdError } from 'react-icons/md'

const NotFound = () => {
  return (
    <div className='container notFound'>
      <MdError />
      <h4>Page Not Found</h4>
    </div>
  )
}

export default NotFound