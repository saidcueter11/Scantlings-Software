import { useLocation } from 'wouter'

export const Material = () => {
  const [location] = useLocation()
  const goBack = () => { history.back() }

  return (
    <>
      <p onClick={goBack}>Go back</p>
      <p>{location}</p>
    </>
  )
}
