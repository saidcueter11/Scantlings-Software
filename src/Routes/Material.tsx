import { useParams } from 'wouter'

export const Material = () => {
  const params = useParams()
  const goBack = () => { history.back() }

  return (
    <>
      <p onClick={goBack}>Go back</p>
      <p>{params.material}</p>
    </>
  )
}
