import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef,useState,useCallback } from 'react';
import {ScrollView,FlatList,Image,ImageBackground,TouchableOpacity,StyleSheet,Modal, Text, View, TouchableHighlight,Dimensions, TextInput,Animated, TouchableWithoutFeedback, Alert } from 'react-native';
import Svg,{G,LinearGradient,Stop,Path, Line} from 'react-native-svg';
import {TriangleColorPicker} from 'react-native-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getAll, getAlbums, searchSongs, SortSongFields, SortSongOrder } from "react-native-get-music-files";
import GradientText from './gt';
import {LinearGradient as Lg} from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import RNRestart from 'react-native-restart';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SvgComp=({path,height,width,color1,color2})=>{
  return (
    <Svg
      height={height}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    ><LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
    <Stop offset="0" stopColor={color1} stopOpacity="1" />
    <Stop offset="1" stopColor={color2} stopOpacity="1" />
  </LinearGradient>
      <Path d={path} fill="url(#grad)"/>
    </Svg>
  )
}

const TabNav=({path,height,width,text,color1,color2,color3,sp})=>{
  return (
    <TouchableOpacity style={TabNavStyles.tabElcontainer} onPress={()=>{sp(text);console.log(text);}}>
      <SvgComp color1={color1} color2={color2} path={path} height={height} width={width}/>
      <Text style={{color:color3}}>{text}</Text>
    </TouchableOpacity>
  );
}

const TabNavStyles=StyleSheet.create({
  tabElcontainer:{
    flexDirection:'column',
    alignItems:'center',
    marginLeft:25,
    marginRight:25,
    marginBottom:0,
  },
})



const FloatTabNav=({path,height,width,text,submodal,smn,smv,color1,color2})=>{
  return (
    <TouchableOpacity style={floatTabStyles.tabElcontainer} onPress={()=>{smn(submodal);smv(true);}}>
      <SvgComp color1={color1} color2={color2} path={path} height={height} width={width}/>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}
const floatTabStyles=StyleSheet.create({
  tabElcontainer:{
    margin:5,
    alignItems:'center',
  }
})
const FloatBar=({setSubModalName,setSubModalVisbile,color1,color2})=>{
  
  return (
    <View style={floatBarStyle.container} >
      <FloatTabNav color1={color1} color2={color2} path="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" height={50} width={50} text="Themes" submodal="theme" smn={setSubModalName} smv={setSubModalVisbile}/>
      <FloatTabNav color1={color1} color2={color2} path="M280-240v-480h80v480h-80ZM440-80v-800h80v800h-80ZM120-400v-160h80v160h-80Zm480 160v-480h80v480h-80Zm160-160v-160h80v160h-80Z" height={50} width={50} text="Equalizer" submodal="equalizer" smn={setSubModalName} smv={setSubModalVisbile}/>
      <FloatTabNav color1={color1} color2={color2} path="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" height={50} width={50} text="Timer" submodal="timer" smn={setSubModalName} smv={setSubModalVisbile}/>
      <FloatTabNav color1={color1} color2={color2} path="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" height={50} width={50} text="More" submodal="settings" smn={setSubModalName} smv={setSubModalVisbile}/>
    </View>
    
  );
}
const floatBarStyle=StyleSheet.create({
  container:{
    width:80,
    flexDirection:'column',
    backgroundColor:'white',
    borderRadius:20,
    borderWidth:2,
    borderColor:'black',
    marginBottom:10,
  },
})
const minutes=4;
const seconds=6;
const FloatSubModal=({subModalName,setSubModalVisbile,uColor,gcolor,st,ct})=>{
  const handleClose = () => {
    setSubModalVisbile(false);
  };
  if(subModalName==="theme"){
    return (
      <ScrollView>
        <View style={subModalStyles.container}>
          <Text style={subModalStyles.heading}>Themes</Text>
          <View >
              <View style={subModalStyles.colorArea}>
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[0]} onColorSelected={(color)=>{uColor(color,0);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>Background</Text>
                </View >
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[1]} onColorSelected={(color)=>{uColor(color,1);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>Border</Text>
                </View>
              </View>
            </View>
            <View >
              <View style={subModalStyles.colorArea}>
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[2]} onColorSelected={(color)=>{uColor(color,2);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>Text</Text>
                </View>
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[3]} onColorSelected={(color)=>{uColor(color,3);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>Lyrics</Text>
                </View>
              </View>
            </View>
            <View >
              <View style={subModalStyles.colorArea}>
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[4]} onColorSelected={(color)=>{uColor(color,4);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>IconStart</Text>
                </View>
                <View style={{alignItems:'center'}}>
                  <TriangleColorPicker oldColor={gcolor[5]} onColorSelected={(color)=>{uColor(color,5);}} style={{height: 50, width: 50 }} hideSliders={true}/>
                  <Text style={{textAlign:'center'}}>IconEnd</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={()=>{handleClose()}} style={{alignItems:'center',marginTop:10,}}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30}/></TouchableOpacity>
            <Text>Close</Text>
            <Text style={{fontSize:10}}>Note: Click on right end of rectangle below color triangle to change color and close popup to apply it.</Text>
        </View>
      </ScrollView>
    );
  }else if(subModalName==='timer'){
    let timeMin=0;
    let timeSec=0;
    return (
      <ScrollView>
        <View style={subModalStyles.container}>
          <Text style={subModalStyles.heading}>Timer</Text>
          <Text style={{marginBottom:20}}>Turn off music player by setting timer</Text>
          <View style={subModalStyles.timeB}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:5,}}>
              <Text>Minutes : </Text>
              <TextInput style={subModalStyles.input} placeholder="e.g. 15" keyboardType="numeric" onChangeText={(t)=>{timeMin=parseInt(t)}}/>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:20,}}>
              <Text>Seconds : </Text>
              <TextInput style={subModalStyles.input} placeholder="e.g. 15" keyboardType="numeric" onChangeText={(t)=>{timeSec=parseInt(t);console.log(t)}}/>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:50,}}>
              <TouchableOpacity onPress={() => {
              const totalTimeInSeconds = timeMin * 60 + timeSec;
              st(totalTimeInSeconds);
              console.log(totalTimeInSeconds);
              }} style={subModalStyles.timerButton}><Text style={{textAlign:'center'}}>Start</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>{ct()}} style={subModalStyles.timerButton}><Text style={{textAlign:'center'}}>Reset/Stop</Text></TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={()=>{handleClose()}} style={{alignItems:'center',marginTop:10,}}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30}/></TouchableOpacity>
          <Text>Close</Text>
        </View>
      </ScrollView>
    );
  }else if(subModalName==="equalizer"){
    return (
      <ScrollView>
        <View style={subModalStyles.container}>
          <Text style={subModalStyles.heading}>Equalizer</Text>
          <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',top:50}}>
            <View style={{marginBottom:10}}>
              <Slider style={subModalStyles.sliderStyle}/>
              <Text style={{textAlign:'center'}}>50Hz</Text>
            </View>
            <View style={{marginBottom:10}}>
              <Slider style={subModalStyles.sliderStyle}/>
              <Text style={{textAlign:'center'}}>100Hz</Text>
            </View>
            <View style={{marginBottom:10}}>
              <Slider style={subModalStyles.sliderStyle}/>
              <Text style={{textAlign:'center'}}>150Hz</Text>
            </View>
            <View style={{marginBottom:10}}>
              <Slider style={subModalStyles.sliderStyle}/>
              <Text style={{textAlign:'center'}}>200Hz</Text>
            </View>
            <View style={{margin:10}}><Text>NOTE: Equalizer may not stable at this moment. But we will soon replace it with a powerful equalizer.</Text></View>
          </View>
          <TouchableOpacity onPress={()=>{handleClose()}} style={{alignItems:'center',marginTop:70,}}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30}/></TouchableOpacity>
          <Text>Close</Text>
        </View>
      </ScrollView>
    );
  }else{
    return (
        <ScrollView>
          <View style={subModalStyles.container}>
          <Text style={{textAlign:'center',fontFamily:'roman',fontWeight:"900",top:30,position:"relative"}}>RN Music Player</Text>
          <View style={{alignItems:'center',margin:40}}>
            <Text style={{textAlign:'justify'}}>RN music player is an offline music player that can used to play local audio files with highly customisable UI.
              We are constantly working on its improvement. So if you have any complains/problem you can leave a message on the app store in which you have downloaded our app.
              Thank you for using RN music player.
            </Text>
          </View>
          <TouchableOpacity onPress={()=>{handleClose()}} style={{alignItems:'center',}}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30}/></TouchableOpacity>
          </View>
        </ScrollView>
    );
  }
}
const subModalStyles=StyleSheet.create({
  container:{
    height:screenHeight*0.65,
    width:screenWidth*0.65,
    backgroundColor:'white',
    top:screenHeight*0.07,
    left:screenHeight*0.15,
    borderRadius:10,
    alignContent:'center',
    alignItems:'center',
  },
  color:{
    height:screenHeight*0.2,
    width:screenWidth*0.2,
  },
  heading:{
    fontSize:30,
    marginBottom:10,
  },
  colorArea:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    width:'100%',
    marginBottom:20,
  },
  timeB:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  input:{
    borderColor:'black',
    width:screenWidth*0.3,
    borderRadius:50,
    borderWidth:2,
    textAlign:'center',
  },
  timerButton:{
    borderWidth:2,
    borderRadius:5,
    width:screenWidth*0.15,
    marginRight:20,
    borderColor:'black',
    backgroundColor:'grey',
  },
  sliderStyle:{
    height:10,
    width:200,
    padding:0,
  },
})

const retrieveArray=async (key,sampleArray)=>{
  try{
    const arrayData=await AsyncStorage.getItem(key);
    if(arrayData===NULL){
      storeArray(key,sampleArray);
      return sampleArray;
    }
    if(arrayData!==NULL){
      const array=JSON.parse(arrayData);
      return array;
    }
  }catch(error){
    return [];
  }
}
const storeArray=async (key,array)=>{
  try{
    const arrayData=JSON.stringify(array);
    await AsyncStorage.setItem(key,arrayData);
    return array;
  }catch(error){
    return [];
  }
}

export default function App() {
  const arrayColor=['#aa82ab','#a41616','#000000','#000000','#ff3b3b','#20031a']
  const rotateAnim=useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalName,setSubModalName]=useState(" ");
  const [subModalVisible,setSubModalVisbile]=useState(false);
  const [colorInfo,setColorInfo]=useState(arrayColor);
  const [songModalVisible,setSongModalVisible]=useState(false);
  const [isPlaying,setIsPlaying]=useState(false);
  const [currentTab,setCurrentTab]=useState("Songs");
  const [permissionGranted,setPermissionGranted]=useState(false);
  const [AllSongArray,setAllSongArray]=useState([]);
  const [curSongIndex,setCurSongIndex]=useState(0);
  const [curSongArr,setCurSongArr]=useState(0);
  const [sw, setScreenWidth] = useState(Dimensions.get('window').width);
  const [sh, setScreenHeight] = useState(Dimensions.get('window').height);
  const [albumA,setAlbumA]=useState([]);
  const [individualAlbumItems,setIndividualAlbumItems]=useState([]);
  const [individualArtistItems,setIndividualArtistItems]=useState([]);
  const [artistA,setArtistA]=useState([]);
  const [sound, setSound] = useState(null);
  const [isSearchVisibile,setIsSearchVisible]=useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isSubSettingModalVisible,setIsSubSettingModalVisible]=useState(false);
  const [favouriteSongArr,setFavouriteSongArr]=useState([])
  const [sliderValue, setSliderValue] = useState(0);
  const [timerTime,setTimerTime]=useState(0);
  let timefunc;

  const setTimer = (time) => {
    timefunc = setTimeout(() => {
      setIsPlaying(false);
    },time*1000);
    Alert.alert("timer set to: " + (time) + " seconds");
  }
  
  const clearTimer = () => {
    clearTimeout(timefunc);
    Alert.alert("Timer has stopped!")
  }



  function handleSliderChange(value) {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        const newPosition = value * status.durationMillis;
        sound.setPositionAsync(newPosition);
        setSliderValue(value);
      });
    }
  }
  
  

  const saveFavoriteSong = async (index) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      let favorites = [];
  
      if (existingFavorites !== null) {
        favorites = JSON.parse(existingFavorites);
      }
      favorites.push(song);
      setFavouriteSongArr(favorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  
      console.log('Favorite song saved successfully!');
    } catch (error) {
      console.error('Error saving favorite song:', error);
    }
  };

  const handleSearch = (query) => {
    setIsSearchVisible(true);
    setSearchQuery(query);
    const filtered = AllSongArray.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };
  const skipToNext=()=>{
    if(curSongArr.length-1===curSongIndex){
      return;
    }
    setIsPlaying(false);
    setCurSongIndex(curSongIndex + 1);
    setSliderValue(0);
  }
  const skipToPrevious=()=>{
    if(curSongIndex===0){
      return;
    }
    setIsPlaying(false);
    setCurSongIndex(curSongIndex - 1);
    setSliderValue(0);
  }
  const toggleSongModal=(b)=>{
    setSongModalVisible(b);
  }
  const toggleIsPlaying=()=>{
    setIsPlaying(!isPlaying);
  }
  useEffect(() => {
    const loadSound = async () => {
      if (!curSongArr || !curSongArr[curSongIndex]?.url) return;

      const { sound} = await Audio.Sound.createAsync({ uri:  curSongArr[curSongIndex].url });
      setSound(sound);
    };
    loadSound();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [curSongIndex, curSongArr]);
  useEffect(() => {
    
  
    if (sound && isPlaying) {
      console.log("Starting interval...");
      const intervalId = setInterval(async () => {
        const status = await sound.getStatusAsync();
        console.log("Status:", status);
        if (!status.isPlaying) {
          
          setSliderValue(0);
          setIsPlaying(false);
          clearInterval(intervalId);

        }
        setSliderValue(status.positionMillis / status.durationMillis);
      }, 1000);
  
      return () => {
        console.log("Clearing interval...");
        clearInterval(intervalId);
      };
    }
  }, [sound, isPlaying]);
  

  const handlePlayPause = async () => {
    if (!sound) return;

    if (!isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };
  

  useEffect(() => {
    handlePlayPause();
  }, [isPlaying]);


  const updateColor=(colorName,index)=>{
    colorInfo[index]=colorName;
    setColorInfo(colorInfo);
    storeArray("colorInfo",colorInfo);
    console.log("changed"+colorName+colorInfo[index]);
  }
  const getColor=(index)=>{
    return colorInfo[index];
  }
  

  useEffect(()=>{
    const loadColorInfo = async () => {
      try {
        const storedColorInfo = await AsyncStorage.getItem('colorInfo');
        if(storedColorInfo===null){
          storeArray('colorInfo',arrayColor);
          setColorInfo(arrayColor);
        }
        if (storedColorInfo !== null) {
          setColorInfo(JSON.parse(storedColorInfo));
          console.log('Color info loaded from AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading color info from AsyncStorage:', error);
      }
    };

    loadColorInfo();
  },[])

  useEffect(()=>{
    const storeColorInfo=async ()=>{
      try{
        storeArray('colorInfo',colorInfo);
        console.log("color info stored!")
      }catch(err){
        Alert("Error in storing the color!")
      }
    }
    storeColorInfo();
  },[colorInfo])
  

  const rotate360=()=>{
    setModalVisible(true);
    Animated.timing(rotateAnim,{
      toValue:360,
      duration:1000,
      useNativeDriver:true,
    }).start();
  };
  const antiRotate360=()=>{
    setModalVisible(false)
    Animated.timing(rotateAnim,{
      toValue:0,
      duration:1000,
      useNativeDriver:true,
    }).start();
  };
  
  useEffect(() => {
    request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO).then((response) => {
      console.log(response);
      if(permissionGranted===false){
        if (response === 'granted') {
         setPermissionGranted(true); 
        }
      }
      
    });
  }, []);
  const renderAlbumItem=(item)=>{
    const fetchAlbumItems=(item)=>{
      var albArr=[];
      for(var i=0;i<AllSongArray.length;i++){
        if(item.item===AllSongArray[i].album){
          albArr.push(AllSongArray[i]);
        } 
      }
      console.log(albArr);
      setIndividualAlbumItems(albArr);
    }
    return(
    <>
      <TouchableOpacity onPress={()=>{fetchAlbumItems({item})}} style={{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:colorInfo[1],borderRadius:10,marginBottom:10,width:screenWidth*0.9,}}>
        <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M500-360q42 0 71-29t29-71v-220h120v-80H560v220q-13-10-28-15t-32-5q-42 0-71 29t-29 71q0 42 29 71t71 29ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/>
        <Text style={{marginLeft:3,}}>{item?item.substring(0,50):" "}</Text>
      </TouchableOpacity>
    </>
    );
  }
  const renderArtistItem=(item)=>{
    const fetchArtistItems=(item)=>{
      var artArr=[];
      for(var i=0;i<AllSongArray.length;i++){
        if(item.item===AllSongArray[i].artist){
          artArr.push(AllSongArray[i]);
        } 
      }
      console.log(artArr);
      setIndividualArtistItems(artArr);
    }
    return(
    <>
      <TouchableOpacity onPress={()=>{fetchArtistItems({item})}} style={{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:colorInfo[1],borderRadius:10,marginBottom:10,width:screenWidth*0.9,}}>
        <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M740-560h140v80h-80v220q0 42-29 71t-71 29q-42 0-71-29t-29-71q0-42 29-71t71-29q8 0 18 1.5t22 6.5v-208ZM120-160v-112q0-35 17.5-63t46.5-43q62-31 126-46.5T440-440q42 0 83.5 6.5T607-414q-20 12-36 29t-28 37q-26-6-51.5-9t-51.5-3q-57 0-112 14t-108 40q-9 5-14.5 14t-5.5 20v32h321q2 20 9.5 40t20.5 40H120Zm320-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T520-640q0-33-23.5-56.5T440-720q-33 0-56.5 23.5T360-640q0 33 23.5 56.5T440-560Zm0-80Zm0 400Z"/>
        <Text style={{marginLeft:3,}}>{item?item.substring(0,50):" "}</Text>
      </TouchableOpacity>
    </>
    );
  }
  const renderItem = (item,index,array) => (
    <View style={{ padding: 10,flexDirection:'row',borderBottomWidth:2,borderBottomColor:'black',alignItems:'center',justifyContent:'space-between' }}>
      <View style={{marginRight:10,}}>
        {item.cover ? (
        <Image source={{ uri: item.cover }} style={{ width: 50, height: 50,borderRadius:5, }} />
      ) : (
        <Image
          source={require('./simg.jpg')}// Provide the path to your default image
          style={{ width: 50, height: 50,borderRadius:5, }}
        />
      )}
    </View>
      <TouchableOpacity onPress={()=>{setSongIndex(index);setCurSongArr(array);}} style={{flexDirection:'column',height:70,width:screenWidth*0.7}}>
        <Text style={{fontSize:20,}}>{item.title?item.title.substring(0,20):" "}</Text>
        <Text>Artist: {item.artist?item.artist.substring(0,20):" "}</Text>
        <Text>Album: {item.album?item.album.substring(0,20):" "}</Text>
      </TouchableOpacity>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>{setIsSubSettingModalVisible(true)}}>
          <SvgComp height={40} width={40} color1={colorInfo[4]} color2={colorInfo[5]} path="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
        </TouchableOpacity>
      </View>
      
    </View>
  );
  let setArtist=new Set();
  let setAlbum=new Set();
  const setSongIndex=(index)=>{
    setCurSongIndex(index);
    console.log(index);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const result = await getAll({
          limit: 20,
          offset: 0,
          coverQuality: 50,
          minSongDuration: 1000,
          sortBy: SortSongFields.TITLE,
          sortOrder: SortSongOrder.DESC,
        });

        console.log(result+"h");
        setAllSongArray(result || []);
      } catch (error) {
        console.error('Error fetching or saving songs:', error);
      }
    };
    

    fetchData();
  }, [permissionGranted]);
  useEffect(() => {
    if (AllSongArray.length > 0) {
      const setAlbum = new Set();
      const setArtist = new Set();
  
      for (let i = 0; i < AllSongArray.length; i++) {
        setAlbum.add(AllSongArray[i].album);
        setArtist.add(AllSongArray[i].artist);
      }
  
      setAlbumA(Array.from(setAlbum));
      console.log(albumA);
      console.log(setAlbum);
      
      setArtistA(Array.from(setArtist));
      console.log(artistA);
    }
  }, [AllSongArray]);
  const backComp=({funct})=>{
    return (
      <TouchableOpacity onPress={()=>{setIndividualAlbumItems([])}}><Text>Back</Text></TouchableOpacity>
    );
  }
  const backCompa=({funct})=>{
    return (
      <TouchableOpacity onPress={()=>{setIndividualArtistItems([])}}><Text>Back</Text></TouchableOpacity>
    );
  }
  const TabPanel=({panelInfo,songarr})=>{
    if(songarr.length===0){
      return(
        <View style={{marginTop:10}}><Text>No items present in your device to display here!.</Text></View>
      );
    }
    if(panelInfo==="Songs"){
      return (
      <>
        <Text style={{textAlign:'center'}}>Songs</Text>
        <FlatList
        data={songarr} 
        renderItem={({ item, index }) => renderItem(item, index,AllSongArray)} 
        keyExtractor={(item,index) => index.toString()} 
        contentContainerStyle={{flexGrow:1}}
        />
        </>
      );
    }else if(panelInfo==="Albums"){
      console.log(albumA)
      return (
        <View style={{justifyContent:'center'}}>
        <Text style={{textAlign:'center'}}>Albums</Text>
        
        <FlatList
        ListHeaderComponent={individualAlbumItems.length!=0?backComp:<></>}
        data={individualAlbumItems.length!=0?individualAlbumItems:albumA} 
        renderItem={({ item,index }) =>{
          if(individualAlbumItems.length!=0){
            return renderItem(item,index,individualAlbumItems);
          }else{
            return renderAlbumItem(item);
          }
        }}
        keyExtractor={(item,index) => index.toString()} 
        contentContainerStyle={{flexGrow:1}}
        />
        </View>
      );
    }else if(panelInfo==="Artists"){
      console.log(artistA+" dskk")
      return (
        <View style={{justifyContent:'center'}}>
        <Text style={{textAlign:'center'}}>Artists</Text>
        <FlatList
        ListHeaderComponent={individualArtistItems.length!=0?backCompa:<></>}
        data={individualArtistItems.length!=0?individualArtistItems:artistA} 
        renderItem={({ item,index }) =>{
          if(individualArtistItems.length!=0){
            return renderItem(item,index,individualArtistItems);
          }else{
            return renderArtistItem(item);
          }
        }}
        keyExtractor={(item,index) => index.toString()}  
        contentContainerStyle={{flexGrow:1}}
        />
        </View>
      );
    }else if(panelInfo==="Playlists"){
      return (
        <Text>playlist Panel coming soon!</Text>
      );
    }else{
      return (
        <Text>Favourites Panel coming soon!</Text>
      );
    }
  }
  const footercomp=()=>{
    <View style={{height:400,width:screenWidth}}></View>
  }
  return (
    <View style={[styles.container, { backgroundColor: colorInfo[0] }]}>
      <View style={{height:screenHeight*0.220,width:screenWidth,top:0,position:'absolute'}}>
      <ScrollView>
        <View>
          <View style={styles.topMainSlide}>
            <Animated.View style={{transform: [
            { rotate: rotateAnim.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
              })
            }
          ]}}>
              <TouchableOpacity style={styles.mainSettingcss} onPress={() => rotateAnim._value === 0 ? rotate360() : antiRotate360()}>
                <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.searchContainer}>
              <SvgComp height={40} width={40} color1={colorInfo[4]} color2={colorInfo[5]} path="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              <TextInput style={styles.searchInput} placeholder='Search a song' onChangeText={handleSearch}/>
            </View>
            <TouchableOpacity>
            <Svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                  width="60" height="60" viewBox="0 0 211.000000 112.000000"
                  preserveAspectRatio="xMidYMid meet">
              <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                <Stop offset="0" stopColor={colorInfo[4]} stopOpacity="1" />
                <Stop offset="1" stopColor={colorInfo[5]} stopOpacity="1" />
              </LinearGradient>
              <G transform="translate(0.000000,112.000000) scale(0.100000,-0.100000)"
                  fill="url(#grad)" stroke="none">
              <Path d="M1170 1115 c0 -1 35 -58 78 -127 42 -68 185 -300 317 -516 219 -358 242 -392 267 -392 l27 0 -52 83 c-29 46 -171 277 -317 514 -234 381 -268 432 -292 435 -16 3 -28 4 -28 3z M1280 1113 c0 -3 85 -143 188 -311 104 -169 246 -400 316 -514 111 -182 131 -208 153 -208 13 0 23 4 21 8 -3 8 -535 874 -594 968 -22 35 -40 53 -58 56 -14 3 -26 3 -26 1z M50 595 c0 -508 0 -515 20 -515 20 0 20 7 20 495 l0 495 309 0 c257
              0 317 -3 359 -16 151 -49 253 -215 223 -363 -24 -117 -88 -202 -190 -249 -53 -25 -64 -26 -228 -27 -173 0 -173 0 -173 -22 0 -22 4 -23 83 -23 l83 0 44 -145 c40 -132 46 -145 67 -145 13 0 23 4 23 8 0 4 -20 68 -45 142 -25 74 -45 135 -45 137 0 2 10 3 23 3 20 0 27 -15 67 -145 43 -137 46 -145 71 -145 l25 0 -48 141 c-26 78 -45 145 -42 150 3 5 11 9 19 9 12 0 27 -39 95 -245 14 -41 22 -51 43 -53 l25 -3 -53 155 c-45 129 -52 155 -39 160 23 9 34 7 34 -5 0 -6 23 -78 51 
              -160 47 -136 54 -149 75 -149 13 0 24 1 24 3 0 5 -110 319 -115 327 -2 4 13 20 35 35 89 61 145 191 138 319 -7 130 -80 241 -200 307 l-63 34 -357 3 -358 3 0 -516z M1060 596 l0 -516 25 0 25 0 -2 480 c-2 264 -1 480 2 480 3 -1 61 -94 130 -208 203 -335 449 -735 459 -745 5 -5 18 -7 29 -5 19 3 15 12 -38 98 -32 52 -173 282 -313 510 -242 395 -256 415 -286 418 l-31 3 0 -515z M1392 1101 c2 -4 143 -236 313 -514 288 -470 312 -507 338 -507 l27 0 0 515 0 515 -26 0 -25 0 3 -480 c2 -264 2 -480 1 -480 0 0 -13 21 -28 48 -15 26 -87 144 -160 262 -73 118 -192 313 -265 433 -115 187 -136 217 -157 217 -14 0 -23 -4 -21 -9z M1750 886 c0 -220 0 -225 25 -267 l25 -44 0 268 0 267 -25 0 -25 0 0 -224z M1840 811 c0 -287 1 -301 21 -335 12 -20 23 -36 25 -36 2 0 4 151 4 335 l0 335 -25 0 -25 0 0 -299z M1930 740 c0 -352 1 -373 20 -410 11 -22 23 -40 25 -40 3 0 5 184 5 410 l0 410 -25 0 -25 0 0 -370z M140 553 c0 -466 0 -473 20 -473 20 0 20 7 20 450 l0 450 263 0 c242 0 265 -2 307 -21 93 -42 144 -117 144 -214 1 -117 -75 -211 -189 -235 -32 -7 -112 -10 -185 -8 l-130 3 0 -23 0 -24 173 4 c160 3 175 5 221 28 97 50 156 148 156 259 0 69 -25 125 -79 184 -75 82 -95 86 -429 89 l-292 3 0 -472z M230 511 c0 -424 0 -431 20 -431 20 0 20 7 20 405 l0 405 214 0 c204 0 214 -1 246 -22 74 -51 96 -118 61 -190 -36 -74 -61 -83 -243 -83 l-158 0 0 -23 0 -23 168 3 c159 3 171 4 204 27 56 39 82 85 86 155 3 53 0 66 -24 102 
              -15 23 -45 53 -67 68 l-41 26 -227 0 c-125 0 -234 3 -243 6 -14 6 -16 -36 -16 -425z M1150 495 l0 -415 25 0 25 0 0 375 c0 357 -1 378 -20 415 -11 22 -23 40 -25 40 -3 0 -5 -187 -5 -415z M320 463 c0 -376 0 -383 20 -383 20 0 20 7 20 360 l0 360 163 0 c146 0 166 -2 180 -18 21 -23 22 -52 3 -78 -13 -17 -27 -19 -165 -19 -150 0 -151 0 -151 -22 0 -23 1 -23 150 -23 88 0 159 5 173 11 51 23 63 109 23 156 l-24 28 -196 5 -196 5 0 -382z M1240 420 l0 -340 25 0 25 0 0 300 c0 282 -1 303 -20 340 -11 22 -23 40 -25 40 -3 0 -5 -153 -5 -340z M1330 345 l0 -265 25 0 25 0 0 231 c0 217 -1 234 -21 265 -11 19 -23 34 -25 34 -2 0 -4 -119 -4 -265z"/>
              </G>
            </Svg>
            </TouchableOpacity>
          </View>
          <View style={[styles.tabnavigation,{borderBottomColor:colorInfo[1]}]}>
            <ScrollView horizontal={true}>
              <TabNav color1={colorInfo[4]} color2={colorInfo[5]} color3={colorInfo[2]} sp={()=>{setCurrentTab("Songs")}} path="M400-240q50 0 85-35t35-85v-280h120v-80H460v256q-14-8-29-12t-31-4q-50 0-85 35t-35 85q0 50 35 85t85 35Zm80 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={50} width={50} text="Songs"/>
              <TabNav color1={colorInfo[4]} color2={colorInfo[5]} color3={colorInfo[2]} sp={()=>{setCurrentTab("Albums")}} path="M500-360q42 0 71-29t29-71v-220h120v-80H560v220q-13-10-28-15t-32-5q-42 0-71 29t-29 71q0 42 29 71t71 29ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" height={50} width={50} text="Albums"/>
              <TabNav color1={colorInfo[4]} color2={colorInfo[5]} color3={colorInfo[2]} sp={()=>{setCurrentTab("Artists")}} path="M740-560h140v80h-80v220q0 42-29 71t-71 29q-42 0-71-29t-29-71q0-42 29-71t71-29q8 0 18 1.5t22 6.5v-208ZM120-160v-112q0-35 17.5-63t46.5-43q62-31 126-46.5T440-440q42 0 83.5 6.5T607-414q-20 12-36 29t-28 37q-26-6-51.5-9t-51.5-3q-57 0-112 14t-108 40q-9 5-14.5 14t-5.5 20v32h321q2 20 9.5 40t20.5 40H120Zm320-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T520-640q0-33-23.5-56.5T440-720q-33 0-56.5 23.5T360-640q0 33 23.5 56.5T440-560Zm0-80Zm0 400Z" height={50} width={50} text="Artists"/>
              {/* <TabNav color1={colorInfo[4]} color2={colorInfo[5]} color3={colorInfo[2]} sp={()=>{setCurrentTab("Playlists")}} path="M640-160q-50 0-85-35t-35-85q0-50 35-85t85-35q11 0 21 1.5t19 6.5v-328h200v80H760v360q0 50-35 85t-85 35ZM120-320v-80h320v80H120Zm0-160v-80h480v80H120Zm0-160v-80h480v80H120Z" height={50} width={50} text="Playlists"/>
              <TabNav color1={colorInfo[4]} color2={colorInfo[5]} color3={colorInfo[2]} sp={()=>{setCurrentTab("Favourites")}} path="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" height={50} width={50} text="Favourites"/> */}
            </ScrollView>
          </View>
        </View>
        {isSearchVisibile && (<View style={{width:265,height:90,backgroundColor:'grey',position:'absolute',zIndex:2,elevation:50,right:'18%',top:'40%',borderRadius:10,}}>
        <ScrollView horizontal={true}>
        {filteredSongs.map((song,index) => (
          <TouchableOpacity key={index} onPress={()=>{setCurSongIndex(AllSongArray.findIndex(item => item.title === song.title));setCurSongArr(AllSongArray)}}style={{flexDirection:'row',alignItems:'center',marginRight:5,}}>
        <View style={{marginRight:1,}}>
        {song.cover ? (
        <Image source={{ uri: song.cover }} style={{ width: 25, height: 25,borderRadius:5, }} />
         ) : (
        <Image
          source={require('./simg.jpg')}// Provide the path to your default image
          style={{ width: 25, height: 25,borderRadius:5, }}
        />
        )}
        </View>
        <Text>{song.title?song.title.substring(0,10):" "}</Text>
        </TouchableOpacity>
        // You can render other song details as needed
        ))}
        </ScrollView>
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{setIsSearchVisible(false)}}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30}/></TouchableOpacity>
        </View>)}
        
      </ScrollView>
      </View>
       <View style={{width:sw,height:sh*0.7,position:'absolute',top:170,alignItems:'center'}}>
        <TabPanel panelInfo={currentTab} songarr={AllSongArray}/>
       </View>
      
         
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        
      ><TouchableWithoutFeedback  onPress={()=>antiRotate360()}>
        <View style={styles.floatBarOverlay}>
        </View>
        
        </TouchableWithoutFeedback>
        <View style={styles.floatBarModal}>
          <FloatBar setSubModalVisbile={setSubModalVisbile} setSubModalName={setSubModalName} color1={colorInfo[4]} color2={colorInfo[5]} />
        </View>
      </Modal>
      <Modal transparent={true} visible={subModalVisible}>
        <FloatSubModal gcolor={colorInfo} uColor={updateColor} subModalName={subModalName} setSubModalVisbile={setSubModalVisbile} setSubModalName={setSubModalVisbile} subModalVisible={subModalVisible} st={setTimer} ct={clearTimer}/>
      </Modal>
      <View style={{position:'absolute',bottom:2}}>
      <ImageBackground source={ curSongArr[curSongIndex]?.cover ? { uri: curSongArr[curSongIndex].cover } : require('./simg.jpg')}
      style={styles.imageBackground}
      blurRadius={10}
      imageStyle={{borderRadius:30,borderColor:colorInfo[1],borderWidth:3,}}>
        <View style={styles.songBar}>
        <View style={styles.songCover}>
          <Image source={ curSongArr[curSongIndex]?.cover ? { uri: curSongArr[curSongIndex].cover } : require('./simg.jpg')} style={{height:30,width:20,}}/>
        </View>
        <TouchableOpacity style={styles.songDetails} onPress={()=>{toggleSongModal(true)}} animationType="slide">
          <Text style={{color:colorInfo[2]}}>{curSongArr[curSongIndex]?.title?curSongArr[curSongIndex].title.substring(0,10):"no song"}</Text>
        </TouchableOpacity>
        <View style={styles.smallControl}>
          <TouchableOpacity onPress={()=>{skipToPrevious()}}>
            <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M269.23-295.384v-369.232h40.001v369.232H269.23Zm421.54 0L413.846-480 690.77-664.616v369.232ZM650.769-480Zm0 110v-220l-165.23 110 165.23 110Z"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{toggleIsPlaying()}}>
            <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path={isPlaying?"M540-240v-480h180v480H540Zm-300 0v-480h180v480H240Zm340-40h100v-400H580v400Zm-300 0h100v-400H280v400Zm0-400v400-400Zm300 0v400-400Z":"M360-272.307v-415.386L686.154-480 360-272.307ZM400-480Zm0 134 211.538-134L400-614v268Z"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{skipToNext()}}>
            <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M650.769-295.384v-369.232h40.001v369.232h-40.001Zm-381.539 0v-369.232L546.154-480 269.23-295.384ZM309.231-480Zm0 110 165.23-110-165.23-110v220Z"/>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
      </View>
      <Modal visible={songModalVisible}>
      <ScrollView>
        <ImageBackground source={ curSongArr[curSongIndex]?.cover ? { uri: curSongArr[curSongIndex].cover } : require('./simg.jpg')}
        blurRadius={5} imageStyle={{height:'100%',width:'100%'}} style={{opacity:0.8}}>
          
          <View style={[styles.songModalContainer,{height:screenHeight,width:'100%'}]}>
            <View style={styles.topModalSlide}>
              <TouchableOpacity onPress={()=>{toggleSongModal(false)}} style={{flex:1,alignItems:'flex-start'}}>
                <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setIsSubSettingModalVisible(true)}} style={{flex:1,alignItems:'flex-end'}}>
                <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
              </TouchableOpacity>
            </View>
            <View>
              <Image source={ curSongArr[curSongIndex]?.cover ? { uri: curSongArr[curSongIndex].cover } : require('./simg.jpg')} style={{height:200,width:200,}}/>
            </View>
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize:30}}>{curSongArr[curSongIndex]?.title?curSongArr[curSongIndex].title.substring(0,10):"no song"}</Text>
              <Text>Artist: {curSongArr[curSongIndex]?.artist?curSongArr[curSongIndex].artist.substring(0,10):"no song"}</Text>
              <Text>Album: {curSongArr[curSongIndex]?.album?curSongArr[curSongIndex].album.substring(0,10):"no song"}</Text>
            </View>
            <View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity onPress={()=>{skipToPrevious()}}>
                <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{toggleIsPlaying()}}>
                <SvgComp height={80} width={80} color1={colorInfo[4]} color2={colorInfo[5]} path={isPlaying?"M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z":"m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{skipToNext()}}>
                <SvgComp height={50} width={50} color1={colorInfo[4]} color2={colorInfo[5]} path="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z"/>
              </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row',marginBottom:40}}>
                <Slider style={{width:screenWidth*0.6}} value={sliderValue} minimumValue={0}
                maximumValue={1} 
                thumbTintColor={colorInfo[4]}
                maximumTrackTintColor={colorInfo[5]}
                minimumTrackTintColor={colorInfo[4]}
                onValueChange={handleSliderChange}
                disabled={!sound}/>
              </View>
            </View>
          </View>
        </ImageBackground>
        </ScrollView>
      </Modal>

      <Modal visible={isSubSettingModalVisible} transparent={true} >
      <View style={{ width: 200, height:80,backgroundColor:'grey',alignItems:'center',top:'40%',borderRadius:30,left:'30%'}} >
      <View>
        <TouchableOpacity onPress={()=>{Alert.alert("This feature will soon be added!")}}><Text>+ Add to Favourites</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{Alert.alert("This feature will soon be added!")}}><Text>+ Add to a Playlist</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { setIsSubSettingModalVisible(false) }} style={{ alignItems: 'center',marginTop:10, }}><SvgComp path="m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.174 184Q408-132 344.442-159.391q-63.559-27.392-110.575-74.348-47.015-46.957-74.441-110.435Q132-407.652 132-479.826q0-72.174 27.391-135.732 27.392-63.559 74.348-110.574 46.957-47.016 110.435-74.442Q407.652-828 479.826-828q72.174 0 135.732 27.391 63.559 27.392 110.574 74.348 47.016 46.957 74.442 110.435Q828-552.348 828-480.174q0 72.174-27.391 135.732-27.392 63.559-74.348 110.575-46.957 47.015-110.435 74.441Q552.348-132 480.174-132ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" height={30} width={30} /></TouchableOpacity>
    </View>
  </View>
      </Modal>
      
        
      
      
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topMainSlide:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    justifyContent:'space-evenly',
    height:screenHeight/10,
    width:'100%',
    marginTop:15,
  },
  svgContainer:{
  },
  mainSettingcss:{
    // left:screenWidth/30,
    // top:screenWidth/20,
  },
  searchContainer:{
    width:0.65*screenWidth,
    height:0.06*screenHeight,
    backgroundColor:"white",
    borderRadius:50,
    flexDirection:'row',
    alignContent:'center',
  },
  searchInput:{
    width:'80%',
  },
  tabnavigation:{
    borderBottomWidth:2,
    borderBottomColor:'black',
    alignItems:'center',
  },
  floatBarModal:{
    position:'absolute',
    top:screenHeight*0.065,
  },
  floatBarOverlay:{
    width:'100%',
    height:'100%',
    height:screenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  songBar:{
    flexDirection:'row',
    width:screenWidth*0.95,
    bottom:2,
    alignItems:'center',
    justifyContent:'center',
    
  },
  songCover:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  songDetails:{
    flex:3,
    position:'relative',
    right:50,
    justifyContent:'center',
    alignItems:'center'
  },
  smallControl:{
    flex:1,
    justifyContent:'flex-end',
    flexDirection:'row',
  },
  songModalContainer:{
    alignItems:'center',
  },
  topModalSlide:{
    flexDirection:'row',
    width:screenWidth*0.9,
    marginTop:10,
  },

});
