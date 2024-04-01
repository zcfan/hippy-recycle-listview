import { Image, StyleSheet, Text, View } from '@hippy/react'
import HippyRecycleListView from 'hippy-recycle-listview'

import I1 from './assets/aircraft.png'
import I2 from './assets/anim1-1.png'
import I3 from './assets/bg-pattern.jpg'
import I4 from './assets/bg-pattern2.png'
import I5 from './assets/brand.png'
import I6 from './assets/pet206.png'

function Row({ index }: { index: number }) {
  return (
    <View style={styles.row}>
      <Image style={styles.img} source={{ uri: I1().url }} />
      <Image style={styles.img} source={{ uri: I2().url }} />
      <Image style={styles.img} source={{ uri: I3().url }} />
      <Image style={styles.img} source={{ uri: I4().url }} />
      <Image style={styles.img} source={{ uri: I5().url }} />
      <Image style={styles.img} source={{ uri: I6().url }} />
      <Image style={styles.img} source={{ uri: I1().url }} />
      <Image style={styles.img} source={{ uri: I2().url }} />
      <Image style={styles.img} source={{ uri: I3().url }} />
      <Image style={styles.img} source={{ uri: I4().url }} />
      <Image style={styles.img} source={{ uri: I5().url }} />
      <Image style={styles.img} source={{ uri: I6().url }} />
      <Text numberOfLines={1} ellipsizeMode="clip" style={styles.text}>
        {new Array(100).fill(index).join('')}
      </Text>
    </View>
  )
}

export default function ListViewOverLap() {
  const renderRow = (index: number) => {
    return <Row index={index} />
  }

  return (
    <HippyRecycleListView
      renderRow={renderRow}
      numberOfRows={1000}
      style={{ flex: 1 }}
      getRowType={() => 'sample'}
      rowHeight={50}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    height: 150,
    backgroundColor: '#00FF0066',
    flexDirection: 'row',
  },
  text: {
    fontSize: 128,
    textAlign: 'left',
    position: 'absolute',
    opacity: 0.9,
    top: 0,
    left: 0,
  },
  img: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },
})
