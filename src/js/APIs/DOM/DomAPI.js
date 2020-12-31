const localWeatherItemParent = () => document.querySelector('.local-weather-item');

const weatherItemParent = () => document.querySelector('.weather-item-list');

/**
 * @param{DocumentFragment} componentNode
 * @param{Element} parentElement
 * @returns {Element}
 */
const insertComponent = (componentNode, parentElement) => {
    parentElement.append(componentNode)
    return parentElement.lastElementChild
};

/**
 * @param{Element} elementToRemove
 */
const removeElement = elementToRemove => elementToRemove.remove();

/**
 * @param{DocumentFragment} componentNode
 * @param{Element} parentElement
 * @param{Element} oldChildElement
 * @returns {Element}
 */
const replaceComponent = (componentNode, parentElement, oldChildElement) => parentElement.replaceChild(componentNode, oldChildElement);

module.exports = { weatherItemParent, localWeatherItemParent, replaceComponent, insertComponent, removeElement };

