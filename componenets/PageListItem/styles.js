import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemWrapper: {
    marginVertical: 3,
    marginHorizontal: 5,
    paddingVertical: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonWrapper: {
    height: '100%',
  },
  button: {},
  labelContainer: {
    minWidth: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelWrapper: {},
  extraLabelWrapper: {},
  extraLabel: {
    fontSize: 18,
  },
});

export default styles;
