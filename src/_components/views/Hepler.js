export function changePage(self, item) {
    self.setState({
        page: {
            number: item - 1
        }
    }, self.load);
}

export function setData (self, data) {
    self.setState({
        page: data.page,
        data: data._embedded
    });
}

export function setFilteredData (self, data) {
    self.setState({
        page: {
            number: data.number,
            totalPages: data.totalPages,
            totalElements: data.totalElements
        },
        data: data.content
    });
}

export function loadData (self, service, ELEMENTS_PER_PAGE) {
    service
        .findAll(self.state.page.number, ELEMENTS_PER_PAGE)
        .then((res) => setData(self, res));
}

export function loadFilteredData (self, service, ELEMENTS_PER_PAGE, filter) {
    service
        .findAllFiltered(self.state.page.number, ELEMENTS_PER_PAGE, filter)
        .then((res) => setFilteredData(self, res));
}