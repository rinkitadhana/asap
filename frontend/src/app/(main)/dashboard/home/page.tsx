import DashboardWrapper from "../DashboardWrapper"
import Options from "../components/Options"

const page = () => {
  return (
    <DashboardWrapper>
      <div className="p-4">Dashboard Home Page</div>
      <Options />
    </DashboardWrapper>
  )
}

export default page
