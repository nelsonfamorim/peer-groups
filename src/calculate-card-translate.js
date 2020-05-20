export default function calculateCardTranslate(cardIndex) {
  const card = document.getElementById(`card-${cardIndex}`)
  const cardBoundingRec = card.getBoundingClientRect()
  const canvas = document.getElementById('root')
  const canvasBoundingRect = canvas.getBoundingClientRect()

  const desiredLeft = canvasBoundingRect.width / 2 - cardBoundingRec.width / 2 - cardBoundingRec.left
  const desiredTop = canvasBoundingRect.height / 2 - cardBoundingRec.height / 2 - cardBoundingRec.top - (cardIndex - 1) * 4

  return [desiredLeft, desiredTop]
}
