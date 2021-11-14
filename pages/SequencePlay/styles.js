import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sequenceWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentWrapper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  phaseName: {
    fontSize: 32,
    paddingTop: 20,
  },
  phasesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  timeText: {
    fontSize: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default styles;
