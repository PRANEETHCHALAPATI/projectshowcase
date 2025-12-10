import React, {Component} from 'react'
import './index.css'

const BASE_URL = 'https://apis.ccbp.in/ps/projects'
const LOGO_SRC =
  'https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png'
const FAILURE_SRC =
  'https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png'

class ProjectShowcase extends Component {
  state = {
    category: 'ALL',
    isLoading: true,
    projectsList: [],
    error: null,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({isLoading: true, error: null})

    const {category} = this.state
    const url = `${BASE_URL}?category=${encodeURIComponent(category)}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      const {projects = []} = data

      const formattedData = projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({
        projectsList: formattedData,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      if (err.name === 'AbortError') return
      this.setState({
        error: 'Something went wrong. Please try again.',
        isLoading: false,
      })
    }
  }

  onChangeCategory = event => {
    const newCategory = event.target.value
    this.setState({category: newCategory}, this.getProjects)
  }

  // 🔥 FIX: Made static to satisfy ESLint (no use of `this`)
  static renderLoader() {
    return (
      <div
        className="loader-wrapper"
        data-testid="loader"
        role="status"
        aria-live="polite"
        aria-label="Loading projects"
      >
        <div className="dot-spinner" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="loader-text">Fetching projects…</div>
      </div>
    )
  }

  renderErrorView() {
    return (
      <div className="error-view" role="alert">
        <img src={FAILURE_SRC} alt="failure view" className="error-image" />
        <h1 className="error-title">Oops! Something Went Wrong</h1>
        <p className="error-desc">
          We cannot seem to find the page you are looking for
        </p>
        <button className="btn-retry" onClick={this.getProjects}>
          Retry
        </button>
      </div>
    )
  }

  renderProjects() {
    const {projectsList} = this.state

    if (!projectsList.length) {
      return <p className="empty-state">No projects found for this category.</p>
    }

    return (
      <ul className="projects-grid">
        {projectsList.map(project => (
          <li key={project.id} className="project-card">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="project-image"
              />
            ) : (
              <div className="project-image placeholder">No image</div>
            )}
            <p className="project-title">{project.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {categoriesList = []} = this.props
    const {category, isLoading, error} = this.state

    const renderContent = () => {
      if (isLoading) {
        return ProjectShowcase.renderLoader() // updated call
      }
      if (error) {
        return this.renderErrorView()
      }
      return this.renderProjects()
    }

    return (
      <div className="project-showcase">
        <header className="ps-header">
          <img src={LOGO_SRC} alt="website logo" className="ps-logo" />
          <h1 className="ps-brand">Projects Showcase</h1>
        </header>

        <main className="ps-main">
          <div className="controls">
            <label className="visually-hidden" htmlFor="category-select">
              Choose category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={this.onChangeCategory}
              className="category-select"
            >
              {categoriesList.map(({id, displayText}) => (
                <option key={id} value={id}>
                  {displayText}
                </option>
              ))}
            </select>
          </div>

          <section className="content-area">{renderContent()}</section>
        </main>
      </div>
    )
  }
}

export default ProjectShowcase
