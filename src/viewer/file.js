import DownloadableResource from './downloadableresource';

export default class ViewerFile extends DownloadableResource {
    get objectType() {
        return 'file';
    }
};
