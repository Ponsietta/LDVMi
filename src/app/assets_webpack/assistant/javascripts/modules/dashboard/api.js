import rest from '../../misc/rest'

export async function getApplications(paginationInfo) {
  const result = await rest('dashboard/getApplications', { paginationInfo });
  return result.data;
}

export async function getDiscoveries(paginationInfo) {
  const result = await rest('dashboard/getDiscoveries', { paginationInfo });
  return result.data;
}

export async function getDiscovery(id) {
  const result = await rest('dashboard/getDiscovery/' + id, {});
  return result.data.discovery;
}

export async function deleteDiscovery(id) {
  return await rest('dashboard/deleteDiscovery/' + id, {});
}

export async function deleteAllDiscoveries() {
  return await rest('dashboard/deleteAllDiscoveries', {});
}

export async function getDataSources(paginationInfo) {
  const result = await rest('dashboard/getDataSources', { paginationInfo });
  return result.data;
}

export async function deleteDataSource(id) {
  return await rest('dashboard/deleteDataSource/' + id, {});
}

export async function updateDataSource(id, values) {
  return await rest('dashboard/updateDataSource/' + id, values);
}

export async function getVisualizerComponents() {
  const result = await rest('dashboard/getVisualizerComponents', {});
  return result.data.visualizerComponents;
}

export async function addVisualizer(componentTemplateUri) {
  const result = await rest('dashboard/addVisualizer', { componentTemplateUri });
  return result.data.visualizer;
}

export async function deleteVisualizer(id) {
  return await rest('dashboard/deleteVisualizer/' + id, {});
}

export async function updateVisualizer(id, values) {
  return await rest('dashboard/updateVisualizer/' + id, values);
}
