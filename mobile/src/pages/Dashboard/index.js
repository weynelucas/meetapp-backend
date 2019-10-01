import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { format, parseISO, isBefore } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import api from '~/services/api';

import Meetup from '~/components/Meetup';
import Background from '~/components/Background';

import { Container, Header, List, SubscribeButton, Loading } from './styles';

export default function Dashboard() {
  const profile = useSelector(state => state.user.profile);

  const [meetups, setMeetups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFetchingMeetups, setIsFetchingMeetups] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  async function loadMeetups(date, page = 1) {
    setIsFetchingMeetups(true);

    const response = await api.get('/meetups', {
      params: { date, page },
    });

    const { results, nextPage } = response.data;

    const data = results.map(meetup => ({
      ...meetup,
      dateFormatted: format(parseISO(meetup.date), "dd 'de' MMMM', às' HH'h'", {
        locale,
      }),
    }));

    setMeetups(page > 1 ? [...meetups, ...data] : data);
    setCurrentDate(date);
    setCurrentPage(page);
    setHasNextPage(nextPage === null);
    setIsFetchingMeetups(false);
  }

  function loadMore() {
    if (isFetchingMeetups || hasNextPage) return;

    loadMeetups(currentDate, currentPage + 1);
  }

  async function handleSubscription(meetupId) {
    try {
      setIsSubscribing(true);

      await api.post(`meetups/${meetupId}/subscriptions`);

      setMeetups(meetups.filter(m => m.id !== meetupId));
    } catch (err) {
      Alert.alert('Falha ao se inscrever no Meetup', err.response.data.error);
    } finally {
      setIsSubscribing(false);
    }
  }

  function canSubscribe(meetup) {
    const isOwner = meetup.user.id === profile.id;
    const isPast = isBefore(parseISO(meetup.date), new Date());

    return !(isOwner || isPast);
  }

  return (
    <Background>
      <Container>
        <Header value={currentDate} onChangeDate={loadMeetups} />

        <List
          data={meetups}
          keyExtractor={item => String(item.id)}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          renderItem={({ item }) => (
            <Meetup meetup={item}>
              {canSubscribe(item) ? (
                <SubscribeButton
                  loading={isSubscribing}
                  onPress={() => handleSubscription(item.id)}>
                  Realizar inscrição
                </SubscribeButton>
              ) : (
                <></>
              )}
            </Meetup>
          )}
          ListFooterComponent={isFetchingMeetups && <Loading />}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Meetups',
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Icon name="format-list-bulleted" color={tintColor} size={20} />
  ),
};
