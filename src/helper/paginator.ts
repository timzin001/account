export const createConditions = (
  conditions: any,
  viewName: string,
  limit: number,
  offset: number,
) => {
  let cond = [...conditions]
  cond.push({
    $skip: limit * offset,
  })
  cond.push({
    $limit: offset,
  })

  let result = {}
  result[viewName] = cond
  result['count'] = [
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]
  return result
}

export const getDataWithPaginator = (
  arr: any,
  viewName: string,
  limit: number,
  offset: number,
  noLimit: boolean,
) => {
  if (!arr || !arr.length) {
    return {
      list: [],
      paginator: { total: 0, limit: limit, offset: offset },
    }
  }
  const item = arr[0]
  const data = item[viewName]
  const count = item.count
  let total = 0
  if (count && count.length) {
    const countItem = count[0]
    total = countItem.total
  }

  let obj = { total: total, limit: limit, offset: offset }
  if (noLimit) {
    obj.limit = total
  }

  return {
    list: data,
    paginator: obj,
  }
}

export const getOffsetAndLimit = (viewName: string, paramObj: any) => {
  let obj: any = {}

  let arr = []
  if (!paramObj.noLimit) {
    arr = [
      {
        $skip: paramObj.offset,
      },
      {
        $limit: paramObj.limit,
      },
    ]
  }

  obj[viewName] = arr

  obj.count = [
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]
  return {
    $facet: obj,
  }
}

export const getSortObject = (paramObj: any) => {
  if (paramObj.sortField && paramObj.sortField.startsWith('-')) {
    let sortObj = {}
    let sortField = paramObj.sortField.substring(1, paramObj.sortField.length)
    sortObj[sortField] = -1
    return sortObj
  }
  if (paramObj.sortField && !paramObj.sortField.startsWith('-')) {
    let sortObj = {}
    sortObj[paramObj.sortField] = 1
    return sortObj
  }
}
