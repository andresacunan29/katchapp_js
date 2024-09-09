import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FilterBar from './FilterBar';
import { setStatusBarHidden } from 'expo-status-bar';

const API_KEY = 'QlQCAYj0lhryo7bpmlFGXgDAI2PKAJ01';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasMoreEvents, setHasMoreEvents] = useState(true); // New state to track if there are more events

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedDate]);

  const fetchEvents = async (pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${BASE_URL}?apikey=${API_KEY}&city=Saint%20Louis&sort=date,asc&page=${pageNumber}&size=20`;

      if (searchQuery) {
        url += `&keyword=${encodeURIComponent(searchQuery)}`;
      }
      
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        url += `&startDateTime=${formattedDate}T00:00:00Z`;
      }

      const response = await axios.get(url);
      
      if (response.data && response.data._embedded && response.data._embedded.events) {
        const newEvents = pageNumber === 0 ? response.data._embedded.events : [...events, ...response.data._embedded.events];
        setEvents(newEvents);
        setPage(pageNumber);
 
        // check if there are fewer events than the requested page size, which means no more events

        if (response.data._embedded.events.length<20){
          setHasMoreEvents(false); // No more events to load
        } else {
          setHasMoreEvents(true); // More events to load
        }
      } else {
        setError('No events found');
        setHasMoreEvents(false); // Stop trying to add more events if none found
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
      setHasMoreEvents(false); // Stop loading more events in case of an error
    } finally {
      setLoading(false);
    }
  };

  // Callback function for pull-to-refresh
  const onRefresh = useCallback(() => {
    setPage(0);
    setHasMoreEvents(true); // Reset this when refreshing
    fetchEvents(0);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
    setHasMoreEvents(true); // Reset this when a new search is performed
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    setPage(0);
    setHasMoreEvents(true); // Reset this when a new filter is applied
  };

  const renderEvent = ({ item }) => {
    if (!item.dates || !item.dates.start || !item._embedded || !item._embedded.venues) {
      return null; // Skip rendering if crucial data is missing
    }

    const date = new Date(item.dates.start.localDate);
    const monthAbbr = date.toLocaleString('default', { month: 'short' });
    const dayOfMonth = date.getDate();
    const time = item.dates.start.localTime ? new Date(`2000-01-01T${item.dates.start.localTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA';
    
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventContent}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.eventDay}>{dayOfMonth}</Text>
            <Text style={styles.eventMonth}>{monthAbbr}</Text>
            <Text style={styles.eventTime}>{time}</Text>
          </View>
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventVenue}>
              {item._embedded.venues[0].name}, {item._embedded.venues[0].city.name}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: item.images && item.images[0] ? item.images[0].url : 'https://via.placeholder.com/300' }}
          style={styles.eventImage}
        />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreEvents) {
      fetchEvents(page + 1);
    }
  };

  // Render the loading indicator at the bottom when more events are being fetched
  const renderFooter = () => {
    if (!hasMoreEvents) {
    return (
      <View style={styles.footerLoader}>
        <Text>No more events to load</Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" />
          <Text>Loading more events...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FilterBar onSearch={handleSearch} onDateFilter={handleDateFilter} />
      {loading && events.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error && events.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchEvents()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          // Add pull-to-refresh functionality
          refreshing={loading}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  list: {
    padding: 10,
  },
  eventContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  dateTimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 60,
  },
  eventDay: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventMonth: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  eventTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    margin: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
