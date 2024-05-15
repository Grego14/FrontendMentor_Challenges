const d = document
const w = window

d.addEventListener('DOMContentLoaded', async e =>{

  const req = await fetch('./data.json')

  const res = await req.json().then((data) =>{

    const template = d.getElementById('template').content
    const stats = d.getElementById('stats')

    for (const stat of data) {

      const clone = template.cloneNode(true)

      const componentStat = clone.getElementById('component-stat')
      componentStat.classList.add(stat.category.toLowerCase())

      const componentStatLeft = componentStat.children[0]
      const componentStatRight = componentStat.children[1]

      const statIcon = clone.getElementById('stat-icon')
      const statCategory = clone.getElementById('stat-category')
      const statScore = clone.getElementById('stat-score')

      statIcon.src = stat.icon
      statCategory.textContent = stat.category
      statScore.textContent = stat.score

      for (const item of [statIcon, statCategory, statScore, componentStat, componentStatLeft, componentStatRight]) {
        item.removeAttribute('id')
      }

      componentStatLeft.append(statIcon, statCategory)
      componentStatRight.append(statScore)
      componentStat.append(componentStatLeft, componentStatRight)

      stats.append(componentStat)
    }
  })
})
