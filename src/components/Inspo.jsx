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
      quoteDate: '',
      loading: true
    }
  }

  fetchImage = quoteDate => {
    axios({
      url: "https://api.nasa.gov/planetary/apod",
      method: "GET",
      params: {
        date: this.state.quoteDate,
        hd: false,
        api_key: "WqcMNCMIfZ1cWl30wZQLKYwpduVm6yHh7Z2u5p5t"
      }
    })
      .then(response => {
        const url = response.data.media_type === 'image' ? response.data.url : "https://apod.nasa.gov/apod/image/1305/godafoss1600vetter.jpg"
        this.setState({ image: url, imageTitle: response.data.title })
      })
      .catch((error) => {
        console.log(error)
      })
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
        const quoteDate = response.data[quoteIdx].date.split("T")[0]
        console.log(quoteDate)
        this.setState({ quote: parsedQuote, loading: false, quoteDate: quoteDate }, () => this.fetchImage())
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    this.fetchQuote()
  }

  displayLoading = () => {
    return this.state.loading ? 
      <EmptyHourglass />
      :
      <div className="quote-text">{this.state.quote}</div>
  };

  render() {
    return (
      <div className="container">
        <div className="quote-container">
          {this.displayLoading()}
        </div>
        <img
          src={this.state.image}
          alt={this.state.imageTitle}
          className="nasa-image" />
      </div>
    )
  }
}
