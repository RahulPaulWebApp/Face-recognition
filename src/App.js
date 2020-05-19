import React from 'react';
import {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js'
import Signin from './components/Signin/Signin.js'
import './App.css';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Register from './components/Register/Register.js';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'


const particleOptions={
                particles: {
                    number:{
                      value: 100,
                      density:{
                        enable: true,
                        value_area: 800
                      }
                    }
                }
              }



const initialState ={
   input: '',
    imageUrl: '',
    box: { },
    route: 'Signin',
    isSignedin: false,
    user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
        }
}
            
class App extends Component{

        constructor() {
          super();
          this.state = {
            input: '',
            imageUrl: '',
            box: { },
            route: 'Signin',
            isSignedin: false,
            user:{
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: ''
                }
          }
        }

        loadUser = (data) =>{
          this.setState({user:
                      {
                      id: data.id,
                      name: data.name,
                      email: data.email,
                      entries: data.entries,
                      joined: data.joined
          
                    }
                  })
          console.log('lol')
        }

        displayFaceBox = (box) => {
          this.setState({box: box});
        } 

        calculateFaceLocation = (data) =>{
                  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
                  const image = document.getElementById('inputimage');
                  const height= Number(image.height);
                  const width = Number(image.width);
                  console.log(width, height);
                  return{
                    leftCol: clarifaiFace.left_col * width,
                    topRow: clarifaiFace.top_row * height,
                    rightCol: width - (clarifaiFace.right_col * width),
                    bottomRow: height - (clarifaiFace.bottom_row * height)
                  }
                }

        onInputChange = (event) =>{
          this.setState({input: event.target.value}); 
        }


        onButtonSubmit = () => {
          this.setState({imageUrl: this.state.input});
            fetch('http://localhost:3000/imageurl', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                input: this.state.input
              })
            })
            .then(response => response.json())
            .then(response => {
              if (response) {
                fetch('http://localhost:3000/image', {
                  method: 'put',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    id: this.state.user.id
                  })
                })
                  .then(response => response.json())
                  .then(count => {
                    this.setState(Object.assign(this.state.user, { entries: count}))
                  })
                  .catch(console.log)

              }
              this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
        }


        onRouteChange = (route) => {
            if(route === 'signout')
            {
              this.setState(initialState)
            }
            else if (route === 'home')
            {
              this.setState({isSignedin: true})
            }
              this.setState({route: route})
        }

        render() {
          const { isSignedin, imageUrl, route, box } = this.state;
          return (
              
            <div className="App">

              <Particles  className="particles"
              params={particleOptions}/>
              <Navigation isSignedin={ isSignedin } onRouteChange={this.onRouteChange} />
              { route === 'home' 
              ? <div>
                  <Logo />              
                  <Rank 
                    name={this.state.user.name}
                    entries={this.state.user.entries} 
                  />
                  <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                  <FaceRecognition box={box} imageUrl={imageUrl} />
                </div> 
              : (
                route === 'Signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
              
              )
              }
            </div>
          );
        }
}
export default App;
