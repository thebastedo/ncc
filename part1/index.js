let fs = require('fs')

let file = process.argv[2]

if (!file) {
  console.log('You must specify a file: node index.js file.txt')
  return
} else if (!fs.existsSync(file)) {
  console.log('File \'%s\' does not exist', file)
  return
}

fs.readFile(file, { encoding: 'utf8' }, (error, data) => {
  if (error) {
    console.log('Error reading file:')
    console.log(error)
    return
  }

  let lines = data.split('\n')
  let hits = new Map()

  lines.forEach((line) => {
    if (!line) {
      return
    }

    let [date, url] = line.split('|')
    let key = new Date(parseFloat(date)*1000).toDateString()
    if (!hits.has(key)) {
      hits.set(key, {})
    }
    let stats = hits.get(key)
    if (!stats[url]) {
      stats[url] = 1
    } else {
      stats[url] += 1
    }
    hits.set(key, stats)
  })

  new Map([...hits.entries()].sort()).forEach((value, key) => {
    console.log(key)
    let sortable = []
    for (site in value) {
      sortable.push([site, value[site]])
    }
    sortable.sort((a,b) => {
      return b[1] - a[1]
    }).forEach((prop) => {
      console.log('%s: %s', prop[0], prop[1])
    })
  })
})
