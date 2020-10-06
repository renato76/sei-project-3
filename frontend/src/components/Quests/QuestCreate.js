import React from 'react'

import QuestForm from './QuestForm'
import StopForm from './StopForm'
import StopList from './StopList'
import Map from '../map/Map'
import BgMap from '../map/BgMap'
import { createQuest, reverseGeoCode } from '../../lib/api'

class QuestCreate extends React.Component{

  state = {
    questFormData: {
      name: '',
      location: '',
      estTime: '',
      theme: ''
    },
    stopFormData: {
      name: '',
      clue: '',
      answerType: 'Answer',
      answer: '',
      hint: '',
      location: {
        latitude: '',
        longitude: ''
      }
    },
    stops: [],
    flyTo: null,
    tabShow: 'info',
    geocoderValue: null
  }

  themes = ['Food & Drink', 'Sightseeing', 'Adventure', 'Speed']
  
  bgLatLng = [
    (Math.random() * 180) - 90,
    (Math.random() * 360) - 180
  ]

  handleQuestFormChange = event => {
    const questFormData = {
      ...this.state.questFormData,
      [event.target.name]: event.target.value
    }
    this.setState({ questFormData })
  }

  handleQuestSubmit = async () => {
    const location = this.state.stops[0].location
    const newQuestData = { ...this.state.questFormData, stops: [ ...this.state.stops ], location: location }
    console.log(newQuestData)
    await createQuest(newQuestData)
  }

  handleStopFormChange = event => {
    const stopFormData = {
      ...this.state.stopFormData,
      [event.target.id]: event.target.value
    }
    this.setState({ stopFormData })
  }

  handleStopAnswerTypeChange = event => {
    const stopAnswerType = event.target.value
    const stopFormData = { ...this.state.stopFormData, answerType: stopAnswerType }
    this.setState({ stopFormData })
  }

  displayAnswerType = () => {
    const stopAnsweryType = this.state.stopFormData.answerType
    return stopAnsweryType === 'Answer'
  }

  handleStopSubmit = event => {
    event.preventDefault()
    const stops = [ ...this.state.stops ]
    const stopFormData = { ...this.state.stopFormData }
    stops.push(stopFormData)
    this.setState({ stops: [...stops] })
  }

  selectLocation = (location, details) => {
    const { latitude, longitude } = location
    console.log(details.place_name)
    const flyTo = { latitude, longitude }
    const stopLocation = { latitude: latitude, longitude: longitude }
    const updateStop = { ...this.state.stopFormData, location: stopLocation }
    this.setState({ flyTo, stopFormData: updateStop, geocoderValue: details.place_name }, () => this.setState({ flyTo: null, geocoderValue: null }))
  }

  selectTab = (event) => {
    this.setState({ tabShow: event.target.value })
  }

  handleMapStopLocale = async (location) => {
    const localeName = await reverseGeoCode(location)
    const geocoderValue = localeName.data.features[0].place_name
    const stopFormData = { ...this.state.stopFormData, location: location }
    this.setState({ stopFormData, geocoderValue }, () => this.setState({ geocoderValue: null }))
  }

  render() {

    const { questFormData, stopFormData, stops, flyTo, tabShow } = this.state

    return (
      <div className="create-quest">
        <BgMap latLng={this.bgLatLng} />
        <h3>Create a New Quest</h3>
        <div>
          <div className="create-container">
            <div className="create-info">
              <div className="show-tabs">
                {['info', 'stops'].map((tab, i) => (
                  <button key={i} value={tab} onClick={this.selectTab} className={`tab ${tabShow === tab ? '' : 'inactive'}`} >{tab.toUpperCase()}</button>
                ))}
              </div>
              <div className="create-tab" style={{ display: tabShow === 'info' ? 'block' : 'none' }}>
                <QuestForm
                  questFormData={questFormData}
                  handleQuestFormChange={this.handleQuestFormChange}
                  handleQuestSubmit={this.handleQuestSubmit}
                  themes={this.themes}
                />
              </div>
              <div className="create-tab" style={{ display: tabShow === 'stops' ? 'block' : 'none' }}>
                <StopForm
                  stopFormData={stopFormData}
                  geocoderValue={this.state.geocoderValue}
                  handleStopFormChange={this.handleStopFormChange}
                  handleStopAnswerTypeChange={this.handleStopAnswerTypeChange}
                  displayAnswerType={this.displayAnswerType}
                  handleStopSubmit={this.handleStopSubmit}
                  selectLocation={this.selectLocation}
                />
              </div>
            </div>
            <div className="create-map">
              <Map flyTo={flyTo} getBounds={() => null} handleMapStopLocale={this.handleMapStopLocale} />
            </div>
          </div>
          <StopList stops={stops} />
          <div className="btn-submit-quest">
            <button onClick={this.handleQuestSubmit}>Save Quest</button>
          </div>
        </div>
      </div>
    )
  }
}

export default QuestCreate