import { Loader as RsuiteLoader } from 'rsuite';

const Loader = () => {
  return (
    <div>Loading</div>
  )
}

export default Loader

export const Skeleton = () => {
  return <div className="skeletonLoader">
    <div className="skeletonShape"></div>
    <div className="skeletonShape"></div>
    <div className="skeletonShape"></div>
  </div>
}