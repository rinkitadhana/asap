import React from "react"
import { FaGithub } from "react-icons/fa"

const GithubButton = () => {
  return (
    <a
      href="https://github.com/rinkitadhana/bordre"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Github"
      className="cursor-pointer p-2 hover:bg-hover rounded-md transition-all duration-200"
    >
      <FaGithub size={20} />
    </a>
  )
}

export default GithubButton
