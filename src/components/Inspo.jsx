import React, { Component } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import EmptyHourglass from './EmptyHourglass';

export default class Inspo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      imageTitle: '',
      quote: '',
      loading: true
    }
  }

  fetchQuote = () => {
    axios({
      url: "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand",
      method: "GET"
    })
      .then(response => {
        const quoteIdx = Math.floor(Math.random() * (9 - 0 + 1)) + 0
        const randomQuote = response.data[quoteIdx].content.rendered
        const parsedQuote = parse(randomQuote)[0].props.children
        this.setState({ quote: parsedQuote, loading: false })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchImage = () => {
    axios({
      url: "https://api.nasa.gov/planetary/apod",
      method: "GET",
      params: {
        hd: false,
        api_key: "WqcMNCMIfZ1cWl30wZQLKYwpduVm6yHh7Z2u5p5t"
      }
    })
      .then(response => {
        this.setState({ image: response.data.url, imageTitle: response.data.title })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    this.fetchQuote()
    this.fetchImage()
  }

  displayLoading = () => {
    return this.state.loading ? 
      <EmptyHourglass />
      :
      <div className="quote-text">{this.state.quote}</div>
  };

  render() {
    return (
      <div className="quote-container">
        {this.displayLoading()}
        <img
          src={this.state.image}
          alt={this.state.imageTitle}
          className="nasa-image" />
      </div>
    )
  }
}