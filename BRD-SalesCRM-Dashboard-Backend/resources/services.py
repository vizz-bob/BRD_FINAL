def increment_download(resource):
    resource.downloads += 1
    resource.save()