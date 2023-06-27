import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const API_KEY = '3b11dd9d8028737a24236ad9fd82f4ed';
const BASE_URL = 'https://api.themoviedb.org/3';


interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      searchMovies();
    } else {
      fetchInitialMovies();
    }
  }, [searchTerm]);

  const fetchInitialMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
      const moviesData: Movie[] = response.data.results;
      setMovies(moviesData);
    } catch (error) {
      console.error(error);
    }
  };

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&include_adult=false `
      );
      const moviesData: Movie[] = response.data.results;
      setMovies(moviesData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detalhes', { movie });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <ListItem bottomDivider>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        placeholderTextColor="#fff"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      {searchTerm ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
        />
      ) : (
        <>
          <Text style={styles.screenTitle}>Lançamentos</Text>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
           
          />
        </>
      )}
      
    </View>
  );
};

const MovieDetailsScreen: React.FC<any> = ({ route }) => {
  const { movie } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.moviePoster} />
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Text style={styles.movieOverview}>{movie.overview}</Text>
      
    </View>
  );
};

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MovieApp" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={MovieDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: "#1E1E1E",
    color: "#fff",
    

  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3A3F47",
    height: 42,
    padding: 10,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: -10,
    color: "#fff",  
  },

  scrollCard: {
    width: "100%",
    height: "100%",
  },
  screenTitle: {
    marginTop: 10,
    fontSize: 20,
    lineHeight: 45,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  poster: {
    width: 145,
    height: 210,
    borderRadius: 15,
    marginRight: 20,
    backgroundColor:  "#1E1E1E",
   
 
  },
  moviePoster: {
    width: 200,
    height: 300,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#1E1E1E",  
    alignSelf:"center"
  
  
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1E1E1E",
    textAlign: "center",

  },
  movieOverview: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#1E1E1E",
    color: "#fff",
    justifyContent: "space-between",
    
    
  },
});

export default App;
