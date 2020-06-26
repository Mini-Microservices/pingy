import {motion } from "framer-motion"
import { useState, useEffect } from "react"

const variants = {
  open: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  closed: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const numVariants = {
  open: {
    y: 0,
    opacity: 1
  },
  closed: {
    y: "-100%",
    opacity: 0
  }
};

export default function Home() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState("200")
  const [mimic, setMimic] = useState(status)

  useEffect(() => {
    setMimic(status)
  }, [status])

  const fetchPingResponse = async (): Promise<void> => {
    setOpen(true)
    try {
      const fd = new FormData()
      fd.append("url", url)
      const res = await fetch("https://next-ping.vercel.app/api/ping", {
        method: "POST",
        body: fd
      })
      const json = await res.json()
      console.log(json)
      if (json?.code) {
        if (isNaN(parseInt(json.code))) {
          setStatus("XXX")
        } else {
          setStatus(json.code)
        }
      } else {
        setStatus("XXX")
      }
    }
    catch (e) {
      setStatus("XXX")
    }
    finally {
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-auto items-center flex-col">
      <div className="relative">
        <motion.h2
          className="font-bold tracking-widest status leading-none relative z-10"
          variants={variants}
          animate={!open ? "open" : "closed"}
        >
          <motion.span variants={numVariants}>{status[0]}</motion.span>
          <motion.span variants={numVariants}>{status[1]}</motion.span>
          <motion.span variants={numVariants}>{status[2]}</motion.span>
        </motion.h2>
        <h2 className="font-bold tracking-widest status leading-none text-gray-200 absolute top-0 left-0">{mimic}</h2>
      </div>
      <div className="sm:flex mt-5 max-w-md w-full">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="text"
            placeholder="Enter a website URL"
            className="block sm:max-w-xs w-full px-4 py-3 text-base leading-6 appearance-none border border-gray-300 shadow-none bg-white rounded-md placeholder-gray-500 focus:outline-none focus:border-green-300"
            disabled={open}
          />
          <button
            className="relative sm:mt-0 sm:h-auto sm:ml-4 block w-full sm:w-auto border border-transparent px-6 py-3 text-base leading-6 font-semibold leading-snug bg-gray-900 text-white rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition ease-in-out duration-150 hover:bg-gray-600"
            onClick={() => fetchPingResponse()}
            disabled={open}
          >
            <span>Ping</span>
          </button>
        </div>
    </div>
  )
}
