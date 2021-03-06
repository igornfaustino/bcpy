import time
import pylsl
import types
import json
from . import acquisition


@acquisition.register_acquisition
class LSL(acquisition.Acquisition):
    """Reciver using the protocol LSL to get data

    Parameters
    ----------
    frequency: `int`
        frequency of transmission
    channels: :obj:`list` of `str`
        list of eletrodos utilized on the experiment
    """

    def __init__(self, fs: int = 128):
        self.frequency = fs

    def get_label(self):
        pass

    def get_data(self) -> types.GeneratorType:
        """ Resolve a lsl stream of type 'EEG'

        Yield
        -----
        data: :obj:`list` of n_channels
            Data for all channels on one interation

        Raises
        ------
        Exception:
            Fails to resolve data from stream
        """
        # first resolve an EEG stream on the lab network
        print("looking for an EEG stream...")
        streams = pylsl.resolve_byprop('type', 'EEG', timeout=30)

        if (len(streams) == 0):
            raise acquisition.AcquisitionError(
                'unable to resolve an EEG stream')
        inlet = pylsl.StreamInlet(streams[0], recover=False)

        while True:
            chunk, timestamp = inlet.pull_chunk()

            # sometimes... this loop is faster than chunk receiving
            if (timestamp):
                for i in range(len(timestamp)):
                    yield(chunk[i])


@acquisition.register_acquisition
class FileBuffer(acquisition.Acquisition):
    def __init__(self, filename: str = 'data.json'):
        self.filename = filename

    def get_data(self) -> types.GeneratorType:
        with open(self.filename) as source:
            data_structure = json.load(source)
            fs = data_structure["frequency"]
            data = data_structure["data"]
            for data_per_timestamp in data:
                yield data_per_timestamp['data']
                time.sleep(1/fs)


@acquisition.register_acquisition
class Custom(acquisition.Acquisition):
    def __init__(self,
                 get_data: types.FunctionType,
                 get_label: types.FunctionType):
        self.get_data_custom = get_data
        self.get_label_custom = get_label

    def get_data(self) -> types.GeneratorType:
        return self.get_data_custom()

    def get_label(self) -> types.GeneratorType:
        return self.get_label_custom()
