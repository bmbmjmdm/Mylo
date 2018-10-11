/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, requireNativeComponent, StatusBar, AppState, BackHandler, TextInput, ImageBackground, Image, TouchableOpacity, Dimensions} from 'react-native';
import LazyView from './LazyImport';
import bgImage from './background.jpg'
import logoImage from './logo.png'

const {width: WIDTH} = Dimensions.get('window')

export default class App extends Component<Props> {
	
	
	/*================================== Rendering functions ==========================================*/
	
	//the main rendering function, calls the helper render function based on current state
	render() {
		if(this.state.loggedIn){
			return this.renderMainPage();
		}
		else{
			return this.renderLogin();
		}
	}
	
	
	//When the user is logged in, we display all photos as a scrollable grid, using "lazy" loading to ensure we minimize memory
	//LazyView is a bridged custom version of Android's RecyclerView. See ./android/app/src/main/java/com/mylo for components 
	renderMainPage(){
		return (
			<ImageBackground source={bgImage} style={styles.lazyContainer}>
				<LazyView src={this.pictures} style={styles.lazyView}/>
			</ImageBackground>
			
		);
	}
	
	//login screen, initial state, requiring user to enter credentials for fake server call 
	//Elements include a background, logo, username input, password input, and login button
	//Username and Password's background color is either white or red (red if the user failed to login, indicating a field is invalid). When they begin typing again, the color goes back to white. This latter behavior is seen in the onChangeText property 
	renderLogin(){
		return (
			
			<ImageBackground source={bgImage} style={styles.container}>
				
				<Image source={logoImage} style={styles.logo}/>
				
				<TextInput placeholder="Username" onChangeText={(username)=>{this.username = username; if(this.state.usernameRedo){this.setState({usernameColor:'rgba(255,255,255,0.35)', usernameRedo:false});}}} style={[styles.textInput, {backgroundColor: this.state.usernameColor}]} underlineColorAndroid='transparent'/>
				
				<TextInput placeholder="Password" onChangeText={(password)=>{this.password = password; if(this.state.passwordRedo){this.setState({passwordColor:'rgba(255,255,255,0.35)', passwordRedo:false});}}} secureTextEntry={true} style={[styles.textInput, {backgroundColor: this.state.passwordColor}]}  underlineColorAndroid='transparent'/>
				
				<TouchableOpacity style={styles.loginBtn} onPress={this.handleLoginPress}>
					<Text style={styles.loginText}>Login</Text>
				</TouchableOpacity>
				
			</ImageBackground>
		);
	}
	
	
	
	/*====================================== App setup functions ============================ */
	
	constructor(props){
		super(props);
		//the starting state is to NOT be logged in 
		//the username and password inputs are in their initial, white state, and we indicate they do not need to be redone 
		//note we don't use setState here since we're initializing 
		this.state = {loggedIn: false, usernameColor: 'rgba(255, 255, 255, 0.35)', passwordColor: 'rgba(255, 255, 255, 0.35)', usernameRedo: false, passwordRedo:false};  
		//record the current AppState so we have something to compare to later when it changes (see handleAppStateChange)
		this.appState = AppState.currentState
		
		this.username = "";
		this.password = "";
		this.canClick = true;
	  
	}
	
	componentDidMount() {
		//event handlers, see related functions
		AppState.addEventListener('change', this.handleAppStateChange);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		//hide the status bar because it looks nice 
		StatusBar.setHidden(true);
	}
  
    componentWillUnmount() {
		//cleanup
		AppState.removeEventListener('change', this.handleAppStateChange);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}
	
	
	
	//setup the second page of the app after user has logged in
	transition(context){
		context.username = "";
		context.password = "";
		
		fetch('https://jsonplaceholder.typicode.com/photos', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}).then((response) => response.json())
			.then((responseJson) => {
				
				//set the array of pictures we're going to lookup, converting our json from an array of objects to an array of strings (urls)
				context.pictures = responseJson.map(obj =>{ 
					return obj.thumbnailUrl;
				});
				
				//change state to the main app page 
				context.setState({loggedIn:true});
				
				context.canClick = true;
				
			})
			
			//currently not handling errors from server 
			.catch((error) => {
				console.error(error);
				context.canClick = true; 
			});
	}
	
	
	
	
	
	/*============================= App event handlers ============================*/
	
	
	//user is attempting to login
	handleLoginPress=()=>{
		//the user cannot click if there is already a request running 
		if(this.canClick){
			
		this.canClick = false;
		var context = this;
		
		//I'm using jsonplaceholder as a simple endpoint. to test, lookup http://jsonplaceholder.typicode.com/users in your browser and choose a user to login. username = username and password = website 
		fetch('http://jsonplaceholder.typicode.com/users?username='+context.username, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}).then((response) => response.json())
			.then((responseJson) => {
				
				//check username 
				if(responseJson['0']){
					//username is correct
					//check password 
					if(responseJson['0']['website'] == context.password){
						//password is correct, move on to main app
						
						context.transition(context);
					}
					
					else{
						//password is incorrect, indicate to user 
						context.setState({passwordColor:'rgba(220,20,60,0.35)', passwordRedo:true});
						
						//let the user retry
						context.canClick = true;
					}
				}
				else{
					//username is incorrect, indicate to user 
					context.setState({usernameColor:'rgba(220,20,60,0.35)', usernameRedo:true});
					
					//let the user retry
					context.canClick = true;
				}
				
				
			})
			//currently not handling errors from server 
			.catch((error) => {
				console.error(error);
				context.canClick = true; 
			});
		
		}
	}
	
	
	
	//log the user out if the app goes into the background 
	handleAppStateChange=(nextAppState)=>{
		//check if we were put into background
		if (this.appState === 'active' && nextAppState.match(/inactive|background/) ) {
			//log out
			this.setState({loggedIn:false});
		}
		//remember state 
		this.appState = nextAppState;
	}
	
	
	
	//log the user out if the back button is pressed
	handleBackButton=()=>{
		this.setState({loggedIn:false});
		return true;
	}
}






const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	
	lazyContainer:{
		flex: 1
	},
	
	lazyView:{
		flex:1
	},
	
	logo:{
		width:200,
		height:200,
		marginBottom: 60
	},
	
	textInput:{
		color: 'rgba(0, 0, 0, 0.7)',
		width:WIDTH-75,
		height:45,
		fontSize:15,
		textAlign:"center",
		borderRadius: 25,
		marginTop: 20, 
    },
	
	loginBtn:{
		width:WIDTH-150,
		height:45,
		fontSize:15,
		justifyContent:'center',
		borderRadius: 25,
		marginTop: 40, 
		backgroundColor:'rgba(255, 229, 246, 0.5)',
	},
	
	loginText:{
		color: 'rgba(0, 0, 0, 0.5)',
		fontSize:16,
		textAlign:"center",
		
	}
});




