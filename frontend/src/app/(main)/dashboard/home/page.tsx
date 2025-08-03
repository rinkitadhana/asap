import DateComponent from "@/utils/Date"
import Options from "../components/Options"
import TimeComponent from "@/utils/Time"

const page = () => {
  return (
    <div className="flex flex-col gap-8 p-2">

      <div className="flex  gap-4">
        <div className="flex flex-col gap-4 w-[75%]">
          <div className="relative border border-call-border rounded-xl h-[300px]  bg-[url('/img/hero-background.png')] bg-cover bg-center bg-no-repeat ">
            <div className="absolute top-4 left-4 rounded-lg bg-call-primary/50 backdrop-blur-sm px-4 py-2 select-none font-medium">
              You don&apos;t have any upcoming meetings
            </div>
            <div className="absolute bottom-4 left-4  px-4 py-2 flex flex-col gap-2">
              <TimeComponent className="text-7xl font-bold text-white/80" />
              <DateComponent className="text-white/80" />
            </div>

          </div>
          <Options />
        </div>
        <div className="border border-call-border rounded-xl p-4 bg-call-background w-[25%] mt-9 flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Activity Overview</h1>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 border border-call-border rounded-lg bg-call-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
                <p className="text-sm font-medium">Meeting with John Doe</p>
              </div>
              <span className="text-xs text-secondary-text">8:30 PM</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-call-border rounded-lg bg-call-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <p className="text-sm font-medium">Team Standup</p>
              </div>
              <span className="text-xs text-secondary-text">10:00 PM</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-call-border rounded-lg bg-call-primary hover:bg-primary-hover transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
                <p className="text-sm font-medium">Project Review</p>
              </div>
              <span className="text-xs text-secondary-text">11:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">AI Tools</h1>
        <div className="flex gap-4">
          <div className="border border-call-border size-[400px] rounded-xl bg-call-background p-4">
            <div className="h-full w-full bg-call-primary rounded-lg">
            </div>
          </div>
          <div className="border border-call-border size-[400px] rounded-xl bg-call-background p-4">
            <div className="h-full w-full bg-call-primary rounded-lg">
            </div>
          </div>
          <div className="border border-call-border size-[400px] rounded-xl bg-call-background p-4">
            <div className="h-full w-full bg-call-primary rounded-lg">
            </div>
          </div>
          <div className="border border-call-border size-[400px] rounded-xl bg-call-background p-4">
            <div className="h-full w-full bg-call-primary rounded-lg">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
